import { PGlite } from '@electric-sql/pglite';

// Initialize PGlite database
const db = new PGlite();

export async function initDb() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS insights (
      id TEXT PRIMARY KEY,
      source_text TEXT,
      category TEXT,
      sentiment TEXT,
      action_item TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function insertInsight(insight: { id: string; sourceText: string; category: string; sentiment: string; actionItem: string }) {
  await db.query(
    'INSERT INTO insights (id, source_text, category, sentiment, action_item) VALUES ($1, $2, $3, $4, $5)',
    [insight.id, insight.sourceText, insight.category, insight.sentiment, insight.actionItem]
  );
}

export async function getInsights() {
  const result = await db.query('SELECT * FROM insights ORDER BY created_at DESC');
  return result.rows;
}
