import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { DynamicTool } from "langchain/tools";

@Injectable()
export class WebBrowserTool {
  private readonly logger = new Logger(WebBrowserTool.name);
  private browser: WebBrowser;

  constructor(private readonly configService: ConfigService) {
    this.initializeBrowser();
  }

  private async initializeBrowser() {
    try {
      const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');
      
      if (!openAIApiKey) {
        throw new Error('OPENAI_API_KEY not configured');
      }

      const model = new ChatOpenAI({ 
        temperature: 0,
        openAIApiKey,
        modelName: "gpt-3.5-turbo-0613"
      });
      
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey
      });

      this.browser = new WebBrowser({ model, embeddings });
      this.logger.log('WebBrowser tool initialized successfully');
    } catch (error) {
      this.logger.error(`Failed to initialize WebBrowser tool: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Creates a LangChain tool for browsing web pages and extracting information
   * @returns A LangChain Tool that can be used directly or with an agent
   */
  public createTool() {
    return new DynamicTool({
      name: "web-browser",
      description: "Useful for when you need to find something on or summarize a webpage. Input should be a comma separated list of \"valid URL including protocol\",\"what you want to find on the page or empty string for a summary\".",
      func: async (input: string) => {
        try {
          this.logger.log(`WebBrowser tool invoked with input: ${input}`);
          
          // Ensure tool is initialized
          if (!this.browser) {
            await this.initializeBrowser();
          }
          
          // If input doesn't have quotes, add them to make it compatible with the expected format
          if (!input.includes('"')) {
            const parts = input.split(',');
            if (parts.length === 1) {
              // Just a URL, no query
              input = `"${parts[0].trim()}", ""`;
            } else if (parts.length >= 2) {
              // URL and query
              input = `"${parts[0].trim()}", "${parts.slice(1).join(',').trim()}"`;
            }
          }
          
          const result = await this.browser.invoke(input);
          return result;
        } catch (error) {
          this.logger.error(`Error using WebBrowser tool: ${error.message}`, error.stack);
          return `Error accessing the webpage: ${error.message}. Please check the URL and try again.`;
        }
      }
    });
  }
}
