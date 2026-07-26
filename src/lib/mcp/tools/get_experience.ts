import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_experience",
  title: "Get work experience and technical skills",
  description:
    "Returns Francis Phiri's work timeline, day-to-day responsibilities, selected projects, and technical stack.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            current: {
              title: "Junior Data Engineer",
              company: "KHM Technology",
              type: "Full-time",
              responsibilities: [
                "Build and maintain a medallion-architecture data warehouse (bronze / silver / gold).",
                "Write SQL and Python ETL, do dimensional modelling, and run ingestion through Airbyte.",
                "Author SQL scripts, stored procedures, views, and triggers.",
                "Integrate Metabase and Power BI reporting for business and marketing stakeholders.",
                "Work on data governance, data quality, and data-access policies.",
                "Build ASP.NET Web APIs, Kafka integrations, and Docker workflows.",
                "Build n8n automations, OpenAI/Claude agent tooling, and product telemetry.",
              ],
            },
            previous_roles: [
              { title: "Junior Software Developer", company: "Best Health Solutions", type: "Part-time" },
              { title: "Data Science Intern", company: "Wits Business Intelligence Services", type: "Part-time" },
              { title: "Data Engineering Intern", company: "Wits Business Intelligence Services", type: "Part-time" },
              { title: "Lecturing Assistant", company: "University of the Witwatersrand", type: "Part-time" },
            ],
            selected_projects: [
              "KHM Data Warehouse and Reporting Platform",
              "Digital health systems at Best Health Solutions",
              "Institutional analytics and student-success dashboards at Wits",
              "NLP CV shortlisting system",
            ],
            stack: {
              languages: ["Python", "SQL", "C# (ASP.NET Web APIs)", "JavaScript/TypeScript"],
              data_and_tools: ["Airbyte", "Metabase", "Power BI", "Kafka", "Docker", "Git", "n8n"],
              ai: ["OpenAI tooling", "Claude tooling", "Deep reinforcement learning frameworks"],
            },
          },
          null,
          2,
        ),
      },
    ],
  }),
});
