/**
 * AI Service
 * MoneyFlowID Bot
 *
 * Supports Gemini and OpenAI-compatible custom endpoints.
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const DEFAULT_CUSTOM_AI_BASE_URL = 'http://143.14.13.43:1430/v1';
const DEFAULT_CUSTOM_AI_MODEL = 'kiro/claude-haiku-4.5-agentic';
const MAX_AI_RESPONSE_CHARS = 6000;

function getAiProvider() {
  const provider = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  if (provider) return provider;
  if (process.env.CUSTOM_AI_BASE_URL || process.env.OPENAI_BASE_URL) return 'custom';
  return 'gemini';
}

function getCustomConfig() {
  return {
    baseUrl: (process.env.CUSTOM_AI_BASE_URL || process.env.OPENAI_BASE_URL || DEFAULT_CUSTOM_AI_BASE_URL).replace(/\/+$/, ''),
    model: process.env.CUSTOM_AI_MODEL || process.env.OPENAI_MODEL || DEFAULT_CUSTOM_AI_MODEL,
    apiKey: process.env.CUSTOM_AI_API_KEY || process.env.OPENAI_API_KEY || '',
  };
}

function isCustomProvider() {
  return ['custom', 'openai', 'kiro', 'claude'].includes(getAiProvider());
}

function getProviderInfo() {
  if (isCustomProvider()) {
    const { baseUrl, model, apiKey } = getCustomConfig();
    return { provider: 'custom', baseUrl, model, configured: true, hasApiKey: Boolean(apiKey) };
  }
  return {
    provider: 'gemini',
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
    configured: Boolean(process.env.GEMINI_API_KEY),
  };
}

function toTextContent(message) {
  if (!message) return '';
  if (message.content !== undefined) return stringifyContent(message.content);
  if (Array.isArray(message.parts)) return message.parts.map((p) => p.text || '').join('\n');
  return '';
}

function stringifyContent(content) {
  if (content === null || content === undefined) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map((part) => (
      typeof part === 'string' ? part : part.text || part.content || ''
    )).join('\n');
  }
  if (typeof content === 'object') return content.text || content.content || JSON.stringify(content);
  return String(content);
}

function truncateAiText(text) {
  const clean = String(text || '').trim();
  if (clean.length <= MAX_AI_RESPONSE_CHARS) return clean;
  return `${clean.slice(0, MAX_AI_RESPONSE_CHARS)}\n\n[Respons AI dipotong karena terlalu panjang.]`;
}

function mapHistoryForCustom(history = []) {
  return history
    .map((item) => ({
      role: item.role === 'model' ? 'assistant' : item.role,
      content: toTextContent(item),
    }))
    .filter((item) => item.content);
}

function getContentFromCustomBody(body) {
  return body.choices?.[0]?.message?.content
    || body.choices?.[0]?.delta?.content
    || body.choices?.[0]?.text
    || body.output_text;
}

function parseCustomResponseText(bodyText) {
  try {
    const body = JSON.parse(bodyText);
    const content = getContentFromCustomBody(body);
    return content ? stringifyContent(content) : '';
  } catch {}

  const chunks = [];
  for (const line of bodyText.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;

    const data = trimmed.slice(5).trim();
    if (!data || data === '[DONE]') continue;

    try {
      const body = JSON.parse(data);
      const content = getContentFromCustomBody(body);
      if (content) chunks.push(stringifyContent(content));
    } catch {}
  }

  return chunks.join('');
}

async function callCustomChat(messages, options = {}) {
  const { baseUrl, model, apiKey } = getCustomConfig();
  const headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? 500,
      stream: false,
    }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    throw new Error(`Custom AI ${res.status}: ${bodyText.slice(0, 500)}`);
  }

  const content = parseCustomResponseText(bodyText);
  if (!content) throw new Error('Custom AI returned an empty response.');
  return truncateAiText(content);
}

function getClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

function getModel(modelName = 'gemini-3.5-flash') {
  return getClient().getGenerativeModel({ model: modelName });
}

const MODELS = [
  process.env.GEMINI_MODEL,
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash',
].filter(Boolean);

async function executeWithFallback(actionFn) {
  let lastError = null;
  const uniqueModels = [...new Set(MODELS)];
  for (const modelName of uniqueModels) {
    try {
      const model = getModel(modelName);
      return await actionFn(model);
    } catch (err) {
      lastError = err;
      const errMsg = err.message || err;
      console.warn(`[Gemini Fallback] Model ${modelName} failed: ${errMsg.split('\n')[0]}. Trying next...`);
    }
  }
  throw lastError || new Error('All fallback Gemini models failed.');
}

async function generateText(prompt, options = {}) {
  if (isCustomProvider()) {
    return callCustomChat([{ role: 'user', content: prompt }], options);
  }

  const result = await executeWithFallback(async (model) => {
    return await model.generateContent(prompt);
  });
  return truncateAiText(result.response.text());
}

function extractFirstJsonObject(text) {
  const start = text.indexOf('{');
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      depth += 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }

  return null;
}

// =============================================
// TRANSACTION PARSER
// =============================================

/**
 * Parse pesan natural language menjadi transaksi terstruktur
 * @param {string} message - Pesan pengguna
 * @param {Object} userCtx - Konteks user (akun, kategori, sumber income)
 * @param {string} lang - Bahasa ('id' | 'en')
 * @returns {Object|null} - Transaksi terstruktur atau null jika bukan transaksi
 */
async function parseTransaction(message, userCtx, lang = 'id') {
  const { accounts = [], spendingCategories = [], incomeSources = [] } = userCtx;

  const accountNames = accounts.map((a) => a.name).join(', ');
  const categoryNames = spendingCategories.map((c) => c.name).join(', ');
  const sourceNames = incomeSources.map((s) => s.name).join(', ');

  const prompt = `You are a financial transaction parser for an Indonesian personal finance bot.

User message: "${message}"

Available data:
- Accounts/Wallets: ${accountNames || 'Cash, BCA, Gopay'}
- Spending Categories: ${categoryNames || 'Makan/Minum, Transport, Belanja'}
- Income Sources: ${sourceNames || 'Gaji, Freelance'}

Your task: Determine if this message contains a financial transaction.

Rules:
1. If it IS a transaction, return JSON with this EXACT format:
{
  "isTransaction": true,
  "type": "income" or "expense",
  "amount": <number in IDR, parse abbreviations: "25rb"=25000, "100k"=100000, "1jt"=1000000, "1.5jt"=1500000>,
  "category": "<best matching category from the list above, or closest match>",
  "account": "<best matching account from the list above, or closest match, or 'Cash' if unclear>",
  "note": "<brief description of the transaction>",
  "confidence": <0.0 to 1.0>
}

2. If it is NOT a transaction (question, greeting, request for advice, etc.), return:
{
  "isTransaction": false,
  "response": "<helpful response in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}>"
}

Important:
- Amount abbreviations: rb/ribu=×1000, jt/juta=×1000000, k=×1000
- Common Indonesian expense words: beli, bayar, makan, jajan, bensin, tagihan, bayar, transfer
- Common income words: terima, dapat, gaji, bayaran, pemasukan, masuk
- Return ONLY valid JSON, no markdown, no explanation.`;

  try {
    const text = await generateText(prompt, { maxOutputTokens: 500, temperature: 0.2 });

    const jsonText = extractFirstJsonObject(text);
    if (!jsonText) return { isTransaction: false, response: text };

    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      // Quota habis — kembalikan response yang informatif, bukan null
      return {
        isTransaction: false,
        response: lang === 'id'
          ? '⚠️ AI sedang overload, coba lagi dalam beberapa menit ya!'
          : '⚠️ AI is currently overloaded, please try again in a few minutes!'
      };
    }
    console.error('AI parseTransaction error:', msg.split('\n')[0]);
    return null;
  }
}

// =============================================
// FINANCIAL INSIGHT
// =============================================

/**
 * Generate insight keuangan dari data transaksi
 * @param {Array} transactions - Array transaksi bulan ini
 * @param {Array} accounts - Array akun dengan saldo
 * @param {Array} bills - Array tagihan
 * @param {string} lang - Bahasa
 * @returns {string} - Insight text
 */
async function generateInsight(transactions, accounts, bills, lang = 'id') {
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const savings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  // Top kategori pengeluaran
  const expenseByCategory = {};
  transactions.filter((t) => t.type === 'expense').forEach((t) => {
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });
  const topCategories = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([cat, amt]) => `${cat}: Rp ${Math.round(amt).toLocaleString('id-ID')}`)
    .join('\n');

  // Total saldo semua akun
  const totalBalance = accounts.reduce((s, a) => s + (a.balance || 0), 0);

  // Tagihan yang belum dibayar
  const unpaidBills = bills.filter((b) => !b.paidThisMonth && b.active);

  const prompt = `You are MoneyFlow AI, a friendly personal finance advisor for Indonesian users.

Financial summary for this month:
- Total Income: Rp ${Math.round(totalIncome).toLocaleString('id-ID')}
- Total Expense: Rp ${Math.round(totalExpense).toLocaleString('id-ID')}
- Savings: Rp ${Math.round(savings).toLocaleString('id-ID')} (${savingsRate}% savings rate)
- Total Balance across all accounts: Rp ${Math.round(totalBalance).toLocaleString('id-ID')}

Top expense categories:
${topCategories || 'No expense data'}

Unpaid bills this month: ${unpaidBills.map((b) => b.name).join(', ') || 'None'}

Transaction count: ${transactions.length}

Please provide:
1. A brief assessment of this month's financial health (1-2 sentences)
2. 2-3 specific, actionable tips based on the actual data
3. A motivational closing sentence

Language: ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}
Tone: Friendly, encouraging, like a knowledgeable friend
Format: Use emoji sparingly for readability
Keep it concise (max 250 words)`;

  try {
    return await generateText(prompt, { maxOutputTokens: 500, temperature: 0.7 });
  } catch (err) {
    const msg = err.message || '';
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      return lang === 'id'
        ? '⚠️ AI sedang overload saat ini. Coba lagi dalam beberapa menit ya!'
        : '⚠️ AI is currently overloaded. Please try again in a few minutes!';
    }
    console.error('AI generateInsight error:', msg.split('\n')[0]);
    return lang === 'id'
      ? '❌ Tidak dapat menghasilkan insight saat ini. Coba lagi nanti.'
      : '❌ Could not generate insight right now. Please try again later.';
  }
}

// =============================================
// AI CHAT
// =============================================

/**
 * Chat umum dengan AI, dengan konteks keuangan user
 * @param {string} message - Pesan user
 * @param {Array} history - Chat history [{role, parts: [{text}]}]
 * @param {Object} userCtx - Konteks user
 * @param {string} lang - Bahasa
 * @returns {string} - Respons AI
 */
async function chat(message, history = [], userCtx = {}, lang = 'id') {
  const { accounts = [], spendingCategories = [], incomeSources = [], bills = [] } = userCtx;

  const systemContext = `You are MoneyFlow AI, an intelligent personal finance assistant integrated into a Telegram bot called MoneyFlowID.

User's financial profile:
- Accounts: ${accounts.map((a) => `${a.name} (Rp ${Math.round(a.balance || 0).toLocaleString('id-ID')})`).join(', ') || 'Not set up'}
- Income sources: ${incomeSources.map((s) => s.name).join(', ') || 'Not set up'}
- Spending categories: ${spendingCategories.map((c) => c.name).join(', ') || 'Not set up'}
- Monthly bills: ${bills.map((b) => `${b.name} (Rp ${Math.round(b.amount || 0).toLocaleString('id-ID')})`).join(', ') || 'None'}

Guidelines:
- Respond in ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}
- Be friendly, concise, and practical
- Use emoji occasionally for warmth
- If asked about recording a transaction, guide them to use the main menu buttons
- If you can't help with something, say so briefly
- Keep responses under 300 words unless asked for detailed explanation
- Format numbers in Indonesian style (e.g., Rp 1.500.000)`;

  try {
    if (isCustomProvider()) {
      const messages = [
        { role: 'system', content: systemContext },
        ...mapHistoryForCustom(history),
        { role: 'user', content: message },
      ];
      return await callCustomChat(messages, { maxOutputTokens: 500, temperature: 0.7 });
    }

    const result = await executeWithFallback(async (model) => {
      const chatObj = model.startChat({
        history: history.length > 0
          ? [
            { role: 'user', parts: [{ text: systemContext }] },
            { role: 'model', parts: [{ text: 'Siap! Saya MoneyFlow AI, siap membantu keuangan Anda.' }] },
            ...history,
          ]
          : [
            { role: 'user', parts: [{ text: systemContext }] },
            { role: 'model', parts: [{ text: 'Siap! Saya MoneyFlow AI, siap membantu keuangan Anda.' }] },
          ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });
      return await chatObj.sendMessage(message);
    });
    return result.response.text().trim();
  } catch (err) {
    console.error('AI chat error:', err.message);
    return lang === 'id'
      ? '❌ AI sedang tidak tersedia. Coba lagi dalam beberapa saat.'
      : '❌ AI is currently unavailable. Please try again in a moment.';
  }
}

/**
 * Dapatkan saran singkat untuk tagihan yang hampir jatuh tempo
 */
async function getBillReminder(billName, amount, dueDay, lang = 'id') {
  const prompt = `In ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}, write a very short (1 sentence), friendly reminder about paying the bill "${billName}" of Rp ${Math.round(amount).toLocaleString('id-ID')} due on the ${dueDay}th. Add one relevant emoji at the start.`;

  try {
    return await generateText(prompt, { maxOutputTokens: 120, temperature: 0.7 });
  } catch {
    return lang === 'id'
      ? `📅 Jangan lupa bayar tagihan ${billName} sebesar Rp ${Math.round(amount).toLocaleString('id-ID')}!`
      : `📅 Don't forget to pay your ${billName} bill of Rp ${Math.round(amount).toLocaleString('id-ID')}!`;
  }
}

module.exports = {
  getProviderInfo,
  parseTransaction,
  generateInsight,
  chat,
  getBillReminder,
};
