import { DynamicTool } from "langchain/tools";
import { WeaviateService } from "../weaviate/weaviate.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class WeaviateSearchTool {
  constructor(private readonly weaviateService: WeaviateService) {}

  /**
   * Creates a LangChain tool for searching German labor law in Weaviate
   */
  public createTool() {
    return new DynamicTool({
      name: "german-labor-law-search",
      description:
        "Search for information about German labor law. Input should be a specific question or topic related to labor law in Germany.",
      func: async (query: string) => {
        try {
          const results = await this.weaviateService.searchLaborLaw(query);
          
          if (!results || results.length === 0) {
            return "No relevant information found in the German labor law database.";
          }

          // Format the results for the agent to use
          let formattedResults = "Here's what I found about German labor law:\n\n";
          
          results.forEach((result: any, index: number) => {
            formattedResults += `[${index + 1}] `;
            
            // Add the text content
            if (result.properties?.text) {
              formattedResults += `${result.properties.text.slice(0, 1500)}${result.properties.text.length > 1500 ? '...' : ''}\n\n`;
            }
            
            // Add metadata if available
            if (result.properties?.source) {
              formattedResults += `Source: ${result.properties.source}\n`;
            }
            
            // Add a separator between results
            formattedResults += `${'='.repeat(40)}\n\n`;
          });

          return formattedResults;
        } catch (error) {
          console.error("Error using Weaviate search tool:", error);
          return "Sorry, there was an error searching the German labor law database.";
        }
      },
    });
  }
} 