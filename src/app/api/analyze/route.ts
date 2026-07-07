import { NextResponse } from 'next/server';
import { initDb, insertInsight } from '@/lib/db';
// @ts-ignore: Mocking import in case of missing types
import { Agent } from '@google/adk'; 

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: 'Feedback text is required' }, { status: 400 });
    }

    await initDb();

    let insight;
    
    // Configurando o Google ADK
    // Em um ambiente de produção real, as chaves seriam extraídas do process.env
    try {
      const agent: any = new Agent({
        model: 'gemini-1.5-pro',
        instructions: `You are a Revenue Intelligence AI. Analyze the customer feedback and extract:
          - category (e.g. Feature Request, Bug Report, UX Issue, Pricing)
          - sentiment (Positive, Neutral, Negative)
          - actionItem (What should the team do?)
          Return as strict JSON.`,
      } as any);

      const response = await agent.run(text);
      
      // Parse the JSON output from the agent
      const parsed = JSON.parse(response.output || "{}");
      insight = {
        sourceText: text,
        category: parsed.category || "Uncategorized",
        sentiment: parsed.sentiment || "Neutral",
        actionItem: parsed.actionItem || "Review feedback"
      };

    } catch (adkError) {
      console.warn("ADK failed (likely missing API keys), falling back to realistic mock:", adkError);
      
      // MOCK REALISTA (Fallback para MVP funcionar sem configuração de chaves externas)
      insight = {
        sourceText: text,
        category: text.toLowerCase().includes('bug') ? 'Bug Report' : (text.toLowerCase().includes('price') || text.toLowerCase().includes('expensive') ? 'Pricing' : 'UX Issue'),
        sentiment: text.toLowerCase().includes('great') || text.toLowerCase().includes('love') ? 'Positive' : 'Negative',
        actionItem: text.toLowerCase().includes('bug') ? 'Investigate bug reproduction steps' : 'Reach out to customer for more context'
      };
    }

    const fullInsight = {
      id: Math.random().toString(36).substring(7),
      ...insight,
    };

    // Save to PGlite (in-memory/embedded persistence for MVP)
    await insertInsight(fullInsight);

    return NextResponse.json({ insight: fullInsight });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
