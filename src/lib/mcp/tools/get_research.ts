import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_research",
  title: "Get academic and research profile",
  description:
    "Returns Francis Phiri's MSc dissertation summary, research interests, peer-reviewed publications, and proposed PhD direction.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            msc: {
              degree: "MSc in Engineering (Electrical and Information Engineering)",
              institution: "University of the Witwatersrand (Wits)",
              dissertation:
                "Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks",
              summary:
                "Applied TD3 deep reinforcement learning to 5G mobile edge computing, covering eMBB/URLLC coexistence, energy-harvesting constraints, queueing delay, and resource allocation.",
            },
            research_interests: [
              "5G/6G networks",
              "Mobile edge computing",
              "Federated learning",
              "Deep reinforcement learning",
              "Resource allocation",
              "eMBB/URLLC coexistence",
              "Energy-aware offloading",
              "Graph learning",
              "Privacy-aware edge intelligence",
            ],
            publications: [
              {
                venue: "SATNAC 2024",
                award: "Second-Best Paper Award",
                evidence:
                  "https://www.wits.ac.za/news/latest-news/research-news/2024/2024-10/wits-teams-clinch-coveted-satnac-challenge-awards.html",
              },
              { venue: "IEEE GLOBECOM 2025" },
            ],
            proposed_phd:
              "Federated and reinforcement learning for energy-efficient computation offloading in 5G/6G edge networks.",
          },
          null,
          2,
        ),
      },
    ],
  }),
});
