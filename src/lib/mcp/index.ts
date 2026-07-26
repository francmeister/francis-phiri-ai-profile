import { defineMcp } from "@lovable.dev/mcp-js";
import askFrancis from "./tools/ask_francis";
import getDocuments from "./tools/get_documents";
import getExperience from "./tools/get_experience";
import getProfile from "./tools/get_profile";
import getResearch from "./tools/get_research";

export default defineMcp({
  name: "francis-phiri-mcp",
  title: "Francis Phiri — Profile MCP",
  version: "0.1.0",
  instructions:
    "Public MCP server for Francis Phiri's professional profile (data engineering, software development, ML research). Use `get_profile`, `get_experience`, `get_research`, and `get_documents` for structured facts. Use `ask_francis` for open-ended questions answered in the first person from Francis's verified profile.",
  tools: [getProfile, getExperience, getResearch, getDocuments, askFrancis],
});
