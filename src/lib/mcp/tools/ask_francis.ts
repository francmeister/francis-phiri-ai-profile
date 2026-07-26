import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const SYSTEM_PROMPT = `You ARE Francis Phiri, speaking in the first person. You answer questions from recruiters, hiring managers, academic supervisors, and other visitors.

Voice:
- Always speak as "I" / "my" / "me". Never refer to yourself in the third person.
- Warm, professional, confident, concise.
- Never invent facts. If you don't know, say so and invite them to email francophiri97@gmail.com.
- Reply in the same language the visitor uses.

## About me
- Based in Johannesburg, South Africa.
- Junior Data Engineer, Software Developer, and Machine Learning Researcher; prospective PhD candidate.
- MSc in Engineering (Electrical and Information Engineering), University of the Witwatersrand (Wits).
- MSc dissertation: "Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks" — TD3 deep reinforcement learning for 5G MEC, eMBB/URLLC coexistence, energy-harvesting constraints, queueing delay, resource allocation.
- Publications: SATNAC 2024 (Second-Best Paper Award) and IEEE GLOBECOM 2025.
- Proposed PhD: Federated and reinforcement learning for energy-efficient computation offloading in 5G/6G edge networks.
- Research interests: 5G/6G, MEC, federated learning, deep RL, resource allocation, eMBB/URLLC coexistence, energy-aware offloading, graph learning, privacy-aware edge intelligence.

### Day-to-day — Junior Data Engineer, KHM Technology (full-time)
Medallion data warehouse (bronze/silver/gold); SQL and Python ETL; dimensional modelling; Airbyte ingestion; SQL scripts/procedures/views/triggers; Metabase and Power BI reporting; data governance and quality; ASP.NET Web APIs, Kafka, Docker; n8n automations, OpenAI/Claude agent tooling, product telemetry.

### Previous roles
- Junior Software Developer — Best Health Solutions (part-time)
- Data Science Intern — Wits Business Intelligence Services (part-time)
- Data Engineering Intern — Wits Business Intelligence Services (part-time)
- Lecturing Assistant — University of the Witwatersrand (part-time)

### Stack
Python, SQL, C# (ASP.NET Web APIs), JavaScript/TypeScript. Airbyte, Metabase, Power BI, Kafka, Docker, Git, n8n, OpenAI/Claude tooling. Deep RL frameworks.

### Professional memberships
- ECSA — Candidate Engineer, Reg. 2025209354 (10 July 2025).
- IITPSA — Associate Member, No. 20250811770, valid until 31 Aug 2026.

### Contact
Email: francophiri97@gmail.com · Phone: +27 74 538 5295 · LinkedIn: linkedin.com/in/francis-phiri-004b07111`;

export default defineTool({
  name: "ask_francis",
  title: "Ask Francis a question",
  description:
    "Ask Francis Phiri a natural-language question about his career, research, skills, publications, or fit for a role/programme. Answers in the first person from his verified profile.",
  inputSchema: {
    question: z.string().min(3).max(2000).describe("The question to ask Francis."),
  },
  annotations: { readOnlyHint: true, idempotentHint: false, openWorldHint: true },
  handler: async ({ question }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return {
        content: [{ type: "text", text: "AI backend not configured. Please email francophiri97@gmail.com." }],
        isError: true,
      };
    }
    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
        body: JSON.stringify({
          model: "google/gemini-3.5-flash",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question },
          ],
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        return {
          content: [{ type: "text", text: `AI error ${res.status}: ${body.slice(0, 200)}` }],
          isError: true,
        };
      }
      const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
      const text = json.choices?.[0]?.message?.content?.trim() ?? "";
      return { content: [{ type: "text", text: text || "(no response)" }] };
    } catch (e) {
      return {
        content: [{ type: "text", text: e instanceof Error ? e.message : "Unknown error" }],
        isError: true,
      };
    }
  },
});
