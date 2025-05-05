"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Guten Tag! I can assist with German employment law and document preparation. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested queries for quick access
  const suggestedQueries = [
    "What documents do I need for new hires in Germany?",
    "Explain German maternity leave regulations",
    "How to create a compliant employment contract?",
    "Working hours limitations in German law"
  ];

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Define backend URL with Docker container networking support
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 
                      (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
                        ? "http://localhost:3000"
                        : "http://backend:3000"); // Use service name in Docker

  const handleSend = async (e: React.FormEvent<HTMLFormElement> | null, suggestedQuery?: string) => {
    e?.preventDefault();
    
    const userMessage = suggestedQuery || input;
    if (!userMessage.trim() || isLoading) return; // Prevent sending when already loading
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Call the HR agent backend API with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
      
      const response = await fetch(`${BACKEND_URL}/hr-agent/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.answer || "Sorry, I couldn't find relevant information on that topic.",
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error fetching from HR agent:", error);
      
      let errorMessage = "I'm sorry, I encountered a technical issue while retrieving that information. Please try again later.";
      
      // Handle specific error cases
      if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "I'm sorry, the request took too long to process. Please try a more specific question or try again later.";
      }
      
      // Show error message to user
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        sender: "assistant",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Top header with German flag accent */}
      <div className="bg-[#111] border-b border-gray-800 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center text-white">
            HR Legal Assistant
            <div className="ml-3 flex space-x-1">
              <div className="w-4 h-4 bg-black rounded-sm border border-gray-700"></div>
              <div className="w-4 h-4 bg-rose-700 rounded-sm"></div>
              <div className="w-4 h-4 bg-amber-500 rounded-sm"></div>
            </div>
          </h1>
          <span className="bg-[#1a1a2e] text-blue-400 text-xs px-2 py-1 rounded-full font-medium border border-blue-900">German Law Specialist</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Side panel with legal categories */}
        <div className="hidden md:block w-64 bg-[#111] border-r border-gray-800 shadow-sm p-4">
          <h2 className="font-semibold mb-3 text-gray-300">Legal Resources</h2>
          <ul className="space-y-2">
            <li className="p-2 hover:bg-[#1a1a2e] rounded cursor-pointer text-sm flex items-center text-gray-300">
              <span className="mr-2">📄</span> Employment Contracts
            </li>
            <li className="p-2 hover:bg-[#1a1a2e] rounded cursor-pointer text-sm flex items-center text-gray-300">
              <span className="mr-2">⏱️</span> Working Hours
            </li>
            <li className="p-2 hover:bg-[#1a1a2e] rounded cursor-pointer text-sm flex items-center text-gray-300">
              <span className="mr-2">👶</span> Parental Benefits
            </li>
            <li className="p-2 hover:bg-[#1a1a2e] rounded cursor-pointer text-sm flex items-center text-gray-300">
              <span className="mr-2">💶</span> Compensation
            </li>
            <li className="p-2 hover:bg-[#1a1a2e] rounded cursor-pointer text-sm flex items-center text-gray-300">
              <span className="mr-2">🏛️</span> Termination Rules
            </li>
          </ul>
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <h2 className="font-semibold mb-3 text-gray-300">Recent Updates</h2>
            <div className="text-xs text-gray-400 space-y-2">
              <p>• New minimum wage regulations as of Jan 2023</p>
              <p>• Updated remote work tax guidelines</p>
            </div>
          </div>
        </div>

        {/* Main chat area with document-like design */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] p-4 rounded-lg shadow-md ${
                    message.sender === "user" 
                      ? "bg-blue-600 text-white rounded-br-none" 
                      : "bg-[#1a1a2e] border border-gray-800 rounded-bl-none"
                  }`}
                >
                  {message.sender === "assistant" && (
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-[#111] rounded-full flex items-center justify-center mr-2 border border-gray-700">
                        <span className="text-blue-400 text-xs font-bold">§</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-300">HR Legal Assistant</span>
                    </div>
                  )}
                  <p className="text-white">
                    {message.content}
                  </p>
                  <div className={`text-xs mt-2 ${message.sender === "user" ? "text-blue-200" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#1a1a2e] border border-gray-800 rounded-lg p-4 rounded-bl-none max-w-[80%] shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested queries */}
          {messages.length < 3 && (
            <div className="px-4 pb-4">
              <div className="bg-[#111] rounded-lg p-3 border border-gray-800 shadow-md">
                <p className="text-sm text-gray-300 mb-2 font-medium">Common inquiries:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQueries.map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSend(null, query)}
                      className="text-xs bg-[#1a1a2e] border border-gray-700 rounded-full px-3 py-1.5 text-gray-300 hover:bg-[#232344] transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input area with document-themed design */}
          <div className="border-t border-gray-800 bg-[#111] p-4">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about German employment law..."
                className="flex-1 bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className={`rounded-lg p-2.5 ${
                  isLoading || !input.trim() 
                    ? "bg-gray-800 text-gray-600" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              Responses are based on German employment law but should not replace professional legal advice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 