'use client';

export default function LoadingState() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-map-blue font-serif uppercase text-sm tracking-widest">
            Searching the Web...
          </p>
        </div>

        <div className="flex justify-center items-center gap-2">
          <div className="w-2 h-2 bg-map-blue rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-map-blue rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-map-blue rounded-full animate-pulse delay-200" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-parchment border-2 border-map-blue border-opacity-20 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-map-blue bg-opacity-20 rounded w-3/4 mb-3" />
              <div className="h-3 bg-map-blue bg-opacity-10 rounded w-full mb-2" />
              <div className="h-3 bg-map-blue bg-opacity-10 rounded w-5/6" />
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 font-serif text-sm uppercase tracking-widest">
          Consulting multiple sources...
        </p>
      </div>
    </div>
  );
}
