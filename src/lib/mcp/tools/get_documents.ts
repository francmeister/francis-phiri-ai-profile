import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_documents",
  title: "List available documents",
  description:
    "Lists documents (CVs, MSc dissertation, publications, professional-body certificates) that can be requested from Francis by email.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            request_via: {
              website_form: "https://francis-phiri.co.za/documents",
              email: "francophiri97@gmail.com",
            },
            documents: [
              { category: "CV", title: "Data Engineering CV" },
              { category: "CV", title: "Software Development CV" },
              { category: "CV", title: "Academic / Research CV" },
              { category: "Research", title: "MSc Dissertation — Machine Learning-based Computation Offloading in Energy-Harvesting 5G Networks" },
              { category: "Publication", title: "SATNAC 2024 paper (Second-Best Paper Award)" },
              { category: "Publication", title: "IEEE GLOBECOM 2025 paper" },
              { category: "Certificate", title: "ECSA Candidate Engineer Certificate (Reg. 2025209354)" },
              { category: "Certificate", title: "IITPSA Associate Member Certificate (No. 20250811770)" },
            ],
          },
          null,
          2,
        ),
      },
    ],
  }),
});
