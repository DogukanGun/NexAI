import { DynamicTool } from "langchain/tools";
import { ScraperService } from "../scraper/scraper.service";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SearchEngineTool {
  private readonly logger = new Logger(SearchEngineTool.name);

  constructor(private readonly scraperService: ScraperService) {}

  /**
   * Creates a LangChain tool for searching information on the web
   */
  public createTool() {
    return new DynamicTool({
      name: "search-engine",
      description:
        "Search for information about a given topic. Input should be a specific question or topic.",
      func: async (query: string) => {
        try {
          // Use the new search method instead of scrapeWebsite
          const results = await this.scraperService.search(query);
          
          if (!results) {
            return "No relevant information found.";
          }

          // Format the results from both providers
          let formattedResults = "Here's what I found:\n\n";
          
          // Add SearchApi results
          formattedResults += "SEARCH API RESULTS:\n";
          formattedResults += "=".repeat(40) + "\n";
          formattedResults += results.searchApiResults + "\n\n";
          
          // Add Tavily results
          formattedResults += "TAVILY SEARCH RESULTS:\n";
          formattedResults += "=".repeat(40) + "\n";
          formattedResults += results.tavilyResults + "\n\n";

          return formattedResults;
        } catch (error) {
          this.logger.error("Error using search tool:", error);
          return "Sorry, there was an error searching for information.";
        }
      },
    });
  }
} 