import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const LLM_PROVIDER = (process.env.LLM_PROVIDER || 'openai').toLowerCase();

// GET /health
app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

// POST /api/suggest-tags
app.post('/api/suggest-tags', async (req, res) => {
  const { title } = req.body;

  // Validate title
  if (!title || typeof title !== 'string' || title.trim().length < 2) {
    return res.status(400).json({
      error: 'title must be a non-empty string with at least 2 characters.',
    });
  }

  const prompt =
    `You are a personal finance categorization assistant. ` +
    `Given the transaction title below, return ONLY a JSON array of 1 to 5 tags. ` +
    `Each tag must be lowercase and start with #. ` +
    `Example output: ["#food","#groceries"]. ` +
    `Do not include any explanation or extra text — only the JSON array.\n\n` +
    `Transaction title: "${title.trim()}"`;

  try {
    let raw = '';

    if (LLM_PROVIDER === 'anthropic') {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'ANTHROPIC_API_KEY environment variable is not set.',
        });
      }

      const client = new Anthropic({ apiKey });
      const message = await client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      });

      raw = message.content?.[0]?.text ?? '';
    } else {
      // Default: openai
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'OPENAI_API_KEY environment variable is not set.',
        });
      }

      const client = new OpenAI({ apiKey });
      const completion = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      });

      raw = completion.choices?.[0]?.message?.content ?? '';
    }

    // Parse the JSON array from the model response
    let tags = [];
    try {
      // Strip potential markdown code fences before parsing
      const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        tags = parsed.filter((t) => typeof t === 'string');
      }
    } catch {
      // Parsing failed — return empty tags without crashing
      tags = [];
    }

    return res.json({ tags });
  } catch (err) {
    const status = err?.status ?? err?.statusCode ?? null;
    const message = err?.message ?? String(err);
    console.error('LLM request failed:', status ? `HTTP ${status} —` : '', message);
    const clientMsg = status === 401
      ? 'LLM provider rejected the API key (401 Unauthorized). Check your key in .env.'
      : status === 429
        ? 'LLM provider rate limit reached (429). Try again shortly.'
        : `Failed to contact LLM provider.${status ? ` (HTTP ${status})` : ''}`;
    return res.status(500).json({ error: clientMsg });
  }
});

const server = app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT} (provider: ${LLM_PROVIDER})`);
});

server.on("error", (err) => {
  console.error("[server] failed to start:", err?.code || "", err?.message || err);
  process.exit(1);
});