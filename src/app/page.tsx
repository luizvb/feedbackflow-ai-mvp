"use client";

import { useState } from "react";
import { Send, Loader2, MessageSquare, Tag, TrendingUp, AlertCircle } from "lucide-react";

type Insight = {
  id: string;
  sourceText: string;
  category: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  actionItem: string;
  createdAt: Date;
};

export default function Home() {
  const [feedback, setFeedback] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedback }),
      });
      
      const data = await response.json();
      
      if (data.insight) {
        setInsights(prev => [
          {
            ...data.insight,
            id: Math.random().toString(36).substring(7),
            createdAt: new Date(),
          },
          ...prev
        ]);
        setFeedback("");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return <span className="badge badge-positive">Positive</span>;
      case "Negative": return <span className="badge badge-urgent">Negative</span>;
      default: return <span className="badge">Neutral</span>;
    }
  };

  return (
    <main className="dashboard-grid">
      {/* Left Column: Ingestion */}
      <section>
        <div className="glass-panel">
          <h2 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={20} className="text-muted" />
            New Feedback
          </h2>
          <p className="text-muted mb-4 text-sm">
            Paste raw customer feedback from Zendesk, Intercom, or calls.
          </p>
          
          <form onSubmit={handleSubmit}>
            <textarea 
              className="input-glass mb-4" 
              rows={6}
              placeholder="E.g. The new dashboard is so confusing, I can't find the export button anymore..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isAnalyzing}
            />
            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%' }}
              disabled={isAnalyzing || !feedback.trim()}
            >
              {isAnalyzing ? (
                <><Loader2 size={16} className="animate-spin" /> Analyzing with ADK...</>
              ) : (
                <><Send size={16} /> Analyze Feedback</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Right Column: Insights Dashboard */}
      <section>
        <h2 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} className="text-muted" />
          Actionable Insights
        </h2>
        
        {insights.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <AlertCircle size={32} className="text-muted mb-4" style={{ margin: '0 auto' }} />
            <p className="text-muted">No insights yet. Analyze some feedback to see the magic.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {insights.map((insight) => (
              <div key={insight.id} className="glass-panel">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={16} className="text-muted" />
                    <strong style={{ color: '#c084fc' }}>{insight.category}</strong>
                  </div>
                  {getSentimentBadge(insight.sentiment)}
                </div>
                
                <p style={{ marginBottom: '16px', fontSize: '14px', lineHeight: '1.5' }}>
                  <strong style={{ color: '#94a3b8' }}>Raw:</strong> "{insight.sourceText}"
                </p>
                
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                  <p style={{ fontSize: '14px', margin: 0 }}>
                    <strong>Action Item:</strong> {insight.actionItem}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
