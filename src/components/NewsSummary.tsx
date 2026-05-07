'use client';

interface NewsSummaryProps {
  title: string;
  summary: string;
  sources: string[];
  timestamp: string;
}

export default function NewsSummary({ title, summary, sources, timestamp }: NewsSummaryProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="border-3 border-map-blue rounded-lg p-8 shadow-xl relative">
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-map-blue" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-map-blue" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-map-blue" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-map-blue" />

        <div className="mb-6 pb-4 border-b-2 border-map-blue border-opacity-30">
          <h2 className="text-2xl font-bold text-map-blue uppercase tracking-wide">
            Summary
          </h2>
        </div>

        {/* Topic */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        </div>

        {/* Summary text */}
        <div className="prose prose-sm max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
            {summary}
          </p>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-map-blue bg-opacity-20" />
          <span className="text-map-blue font-serif text-xs uppercase tracking-widest">Sources</span>
          <div className="flex-1 h-px bg-map-blue bg-opacity-20" />
        </div>

        {/* Sources */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {sources.slice(0, 4).map((source, idx) => (
            <div key={idx} className="text-xs font-serif text-map-blue bg-white bg-opacity-40 px-3 py-2 rounded border border-map-blue border-opacity-20">
              • {source}
            </div>
          ))}
        </div>

        {/* Timestamp */}
        <div className="text-right">
          <p className="text-xs text-gray-500 font-serif uppercase tracking-widest">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
