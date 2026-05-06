import { CohereClient } from "cohere-ai";
import { NextRequest, NextResponse } from "next/server";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY || "", 
});
const NEWS_API_KEY = process.env.NEWS_API_KEY;

const tools = [
  {
    name: "search_news",
    description: "Searches for global news articles. Best for finding current events and multiple perspectives.",
    parameterDefinitions: {
      query: {
        description: "A specific search query tailored for a news engine.",
        type: "string",
        required: true,
      },
    },
  },
];

export async function POST(req: NextRequest) {
    console.log(process.env.COHERE_API_KEY);
    console.log(process.env.NEWS_API_KEY)
  try {
    const { prompt } = await req.json();

    const chatWithTools = await cohere.chat({
      model: "command-r7b-12-2024",
      message: prompt,
      tools: tools,
      preamble: "You are a neutral news aggregator. Break down complex topics into diverse viewpoints using the search tool.",
    });

    let rawArticles: any[] = [];

    if (chatWithTools.toolCalls) {
      const toolPromises = chatWithTools.toolCalls.map(async (call) => {
        if (call.name === "search_news") {
          const query = (call.parameters as any).query;
          const res = await fetch(
            `https://newsdata.io/api/1/news?apikey=${NEWS_API_KEY}&q=${encodeURIComponent(query)}&language=en`
          );
          if (!res.ok) {
            const text = await res.text(); 
            console.error("Newsdata.io API error:", res.status, text);
            throw new Error(`Newsdata.io responded with status ${res.status}`);
            }
          const data = await res.json();
          console.log("Full News API JSON:", data);
          return data.results || [];
        }
        return [];
      });
      const results = await Promise.all(toolPromises);
      rawArticles = results.flat();
    }

    console.log("Cohere toolCalls:");
    console.dir(chatWithTools.toolCalls, { depth: null });

    console.log("API response from News API:", rawArticles);
    if (rawArticles.length === 0) {
      return NextResponse.json({ message: "I couldn't find any recent news on that topic." });
    }

    const documents = rawArticles.map((a) => ({
    title: a.title,
    text: (a.description || "No content available").substring(0, 5000),
    url: a.link,
    source: a.source_name || a.creator?.[0] || "Unknown",
    }));

    const reranked = await cohere.rerank({
      model: "rerank-english-v3.0",
      query: prompt,
      documents: documents.map(d => d.text),
      topN: 8,
    });

    const bestDocs = reranked.results.map(r => documents[r.index]);

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      message: `Using the provided documents, provide a comprehensive analysis of the different perspectives on: ${prompt}. Use a journalistic tone. 
      Think of the various perspectives in the event, and how each 'side', if there are any, may react to this event. How does each party involved feel about the event?`,
      documents: bestDocs.map((d, i) => ({
        id: `doc_${i}`,
        title: d.title,
        text: d.text,
        url: d.url,
        source: d.source
      })),
    });

    console.log("API response from Cohere API:", response);
    return NextResponse.json({
      answer: response.text,
      citations: response.citations,
      sources: bestDocs,
    });

    } catch (error: any) {
        console.error("NewsAgent POST error:", error);
        return NextResponse.json({ error: error.message || "Agent failed to process news." }, { status: 500 });
    }
}