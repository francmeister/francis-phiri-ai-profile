import { defineTool } from "@lovable.dev/mcp-js";

export default defineTool({
  name: "get_profile",
  title: "Get Francis Phiri's profile",
  description:
    "Returns Francis Phiri's bio, current role, location, contact details, and professional memberships (ECSA, IITPSA).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            name: "Francis Phiri",
            location: "Johannesburg, South Africa",
            headline:
              "Data Engineer, Software Developer, and Machine Learning Researcher; prospective PhD candidate.",
            current_role: "Junior Data Engineer at KHM Technology",
            education:
              "MSc in Engineering (Electrical and Information Engineering), University of the Witwatersrand (Wits)",
            contact: {
              email: "francophiri97@gmail.com",
              phone: "+27 74 538 5295",
              linkedin: "https://linkedin.com/in/francis-phiri-004b07111",
              website: "https://francis-phiri.co.za",
            },
            professional_memberships: [
              {
                body: "Engineering Council of South Africa (ECSA)",
                status: "Candidate Engineer",
                registration_number: "2025209354",
                registered_on: "2025-07-10",
                note: "Formal pathway to Professional Engineer (Pr.Eng) registration under the Engineering Profession Act 46 of 2000.",
              },
              {
                body: "Institute of Information Technology Professionals South Africa (IITPSA)",
                status: "Associate Member",
                membership_number: "20250811770",
                valid_until: "2026-08-31",
                note: "SAQA-recognised professional body (SAQA ID 815); members bound by a formal Code of Ethics.",
              },
            ],
          },
          null,
          2,
        ),
      },
    ],
  }),
});
