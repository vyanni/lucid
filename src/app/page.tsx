'use client';

import { useState } from 'react';
import SearchPrompt from '@/components/SearchPrompt';
import NewsSummary from '@/components/NewsSummary';
import { NewsAgentResult, NewsOutletPerspective } from '@/types/news';
import OutletPerspectives from '@/components/OutletPerspectives';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<NewsAgentResult | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/newsAgent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) {
        throw new Error(`API responded with status ${res.status}`);
      }

      const data = await res.json();

      const perspectives: NewsOutletPerspective[] = data.sources?.map((article: any) => ({
        outlet: article.source || 'Unknown',
        perspective: article.text || '', // Or snippet if you want
        bias: 'neutral',
        confidence: article.confidence ?? 0.5,
        sources: [article.url],
      })) || [];

      const sources: string[] = data.sources?.map((article: any) => article.url) || [];

      const newsResult: NewsAgentResult = {
        query,
        summary: data.answer || 'No summary available.',
        perspectives,
        biasStatistics: [
          { category: 'Positive', percentage: 10, sentiment: 'positive' },
          { category: 'Neutral', percentage: 80, sentiment: 'neutral' },
          { category: 'Negative', percentage: 10, sentiment: 'negative' },
        ],
        sources,
        timestamp: new Date().toISOString(),
      };

      setResult(newsResult);
    } catch (error) {
      console.error('Error fetching news analysis:', error);
      setResult({
        query,
        summary: 'Failed to fetch news. Please try again later.',
        perspectives: [],
        biasStatistics: [],
        sources: [],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-elms flex-col bg-[#F5EEDB] text-[#1C2E4A] selection:bg-[#1C2E4A] selection:text-[#F5EEDB]">
      
      <header className="w-full pt-16">
        <div className="mx-auto px-6 text-center">
          <h1 className="text-8xl sm:text-7xl font-elms font-bold tracking-tight">
            Lucid
          </h1>
          <div className="flex items-center justify-center font-xs text-[#1C2E4A]/70">
            Do your Research.
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <SearchPrompt onSubmit={handleSearch} isLoading={isLoading} />

        {isLoading && (
          <div className="py-24 text-center animate-pulse">
            <p className="text-lg italic text-[#5C4033]">Searching the web...</p>
          </div>
        )}

        {result && !isLoading && (
        <div className="space-y-16 mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <NewsSummary 
            title={result.query}
            summary={result.summary}
            sources={result.sources}
            timestamp={result.timestamp}
          />

          {result.perspectives && result.perspectives.length > 0 && (
            <OutletPerspectives perspectives={result.perspectives} />
          )}
        </div>
      )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-[#1C2E4A]/20 mt-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-[#1C2E4A]/60">
          Created 2026
        </p>
      </footer>
    </div>
  );
}