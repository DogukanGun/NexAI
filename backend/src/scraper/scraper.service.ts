import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SearchApi } from "@langchain/community/tools/searchapi";
import { TavilySearch } from "@langchain/tavily";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Tool } from "@langchain/core/tools";

@Injectable()
export class ScraperService {
    private readonly logger = new Logger(ScraperService.name);

    constructor(
        private readonly configService: ConfigService,
    ) { }

    async search(query: string): Promise<{ searchApiResults: string; tavilyResults: string }> {
        try {
            this.logger.log(`Starting search for query: ${query}`);

            // Get configuration from ConfigService
            const searchApiKey = this.configService.get<string>('SEARCHAPI_API_KEY');
            const tavilyApiKey = this.configService.get<string>('TAVILY_API_KEY');
            const openAIApiKey = this.configService.get<string>('OPENAI_API_KEY');

            if (!searchApiKey) {
                throw new Error('SEARCHAPI_API_KEY not configured');
            }

            if (!tavilyApiKey) {
                throw new Error('TAVILY_API_KEY not configured');
            }

            if (!openAIApiKey) {
                throw new Error('OPENAI_API_KEY not configured');
            }

            // Setup model
            const model = new ChatOpenAI({
                modelName: "gpt-3.5-turbo-0613", // Specify a model that supports function calling
                temperature: 0,
                openAIApiKey,
            });

            // Setup SearchApi tool
            const searchTool = new SearchApi(searchApiKey, {
                engine: "google_news",
            });
            // Set Tavily API key in the environment if not already set
            if (!process.env.TAVILY_API_KEY) {
                process.env.TAVILY_API_KEY = tavilyApiKey;
            }
            // Setup Tavily tool
            const tavilyTool = new TavilySearch({
                maxResults: 5,
                topic: "general",
            });

            // Create two separate agent executors to get results from both sources

            // 1. SearchApi executor
            const searchApiPrompt = ChatPromptTemplate.fromMessages([
                ["system",
                    "You are a research assistant. Your task is to find relevant information about a query. " +
                    "Use the search tool to find information. " +
                    "Return a concise summary of what you find, focusing on the main facts and key information."],
                ["human", "{input}"],
            ]);

            const searchApiAgent = await createOpenAIToolsAgent({
                llm: model,
                tools: [searchTool],
                prompt: searchApiPrompt,
            });

            const searchApiExecutor = new AgentExecutor({
                agent: searchApiAgent,
                tools: [searchTool],
                verbose: this.configService.get<string>('NODE_ENV') === 'development',
                maxIterations: 3,
            });

            // 2. Tavily executor
            const tavilyPrompt = ChatPromptTemplate.fromMessages([
                ["system",
                    "You are a research assistant. Your task is to find relevant information about a query. " +
                    "Use the Tavily search tool to find information. " +
                    "Return a concise summary of what you find, focusing on the main facts and key information."],
                ["human", "{input}"],
            ]);

            const tavilyAgent = await createOpenAIToolsAgent({
                llm: model,
                tools: [tavilyTool],
                prompt: tavilyPrompt,
            });

            const tavilyExecutor = new AgentExecutor({
                agent: tavilyAgent,
                tools: [tavilyTool],
                verbose: this.configService.get<string>('NODE_ENV') === 'development',
                maxIterations: 3,
            });

            // Execute both agents in parallel
            const [searchApiResult, tavilyResult] = await Promise.all([
                searchApiExecutor.invoke({
                    input: `Find information about: ${query}`,
                }).catch(error => {
                    this.logger.error(`Error with SearchApi: ${error.message}`, error.stack);
                    return { output: `Error with SearchApi: ${error.message}` };
                }),
                tavilyExecutor.invoke({
                    input: `Find information about: ${query}`,
                }).catch(error => {
                    this.logger.error(`Error with Tavily: ${error.message}`, error.stack);
                    return { output: `Error with Tavily: ${error.message}` };
                })
            ]);

            this.logger.log(`Search completed successfully for query: ${query}`);

            return {
                searchApiResults: searchApiResult.output,
                tavilyResults: tavilyResult.output
            };
        } catch (error) {
            this.logger.error(`Error during search for "${query}": ${error.message}`, error.stack);
            throw new Error(`Failed to search: ${error.message}`);
        }
    }

    // Keep the old method for backward compatibility, but it now uses the new search functionality
    async scrapeWebsite(url: string): Promise<string> {
        try {
            const results = await this.search(url);
            return `Combined search results:\n\nSearchApi results:\n${results.searchApiResults}\n\nTavily results:\n${results.tavilyResults}`;
        } catch (error) {
            this.logger.error(`Error in scrapeWebsite for "${url}": ${error.message}`, error.stack);
            throw new Error(`Failed to scrape website: ${error.message}`);
        }
    }
}