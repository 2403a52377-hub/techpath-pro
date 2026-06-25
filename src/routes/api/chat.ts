import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are TechLand AI, an expert career coach and learning mentor for engineering students in India.
You help students with:
- Career roadmaps for Full Stack, Frontend, Backend, AI/ML, Data Science, Cybersecurity, Cloud, DevOps
- Personalized learning recommendations and YouTube/coding resources
- Resume review and ATS tips
- Mock interview questions (DSA, system design, behavioral)
- Placement preparation for top tech companies (Google, Amazon, Microsoft, TCS, Infosys, Wipro)
- Skill-gap analysis and project ideas

Be warm, concise, and actionable. Use bullet points when listing. Cite real free resources when recommending courses. If asked about non-career topics, politely redirect.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM_PROMPT,
          messages: await convertToModelMessages(messages),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
