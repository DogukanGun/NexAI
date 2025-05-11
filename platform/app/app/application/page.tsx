"use client";

import { useState, useRef, useEffect, FormEvent, Suspense } from "react";
import AuthCheck from '../../components/AuthCheck';
import styles from '../chat/chat.module.css';

type JobPostingResult = {
  id: string;
  content: string;
  timestamp: Date;
};

// Sanitize HTML by removing style tags
const sanitizeHtml = (html: string): string => {
  return html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
};

export default function ApplicationPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [companyInfo, setCompanyInfo] = useState("");
  const [requirements, setRequirements] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<JobPostingResult | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");
  const resultRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [token, setToken] = useState<string | null>(null);

  // Get token from sessionStorage on component mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!jobTitle.trim()) {
      setError("Please enter a job title");
      return;
    }

    if (!token) {
      setError("Please login to use the job posting generator");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);
    setDebugInfo(`Attempting to connect to: ${BACKEND_URL}`);

    try {
      // Prepare the query for job posting generation
      const query = `Generate a detailed job posting for ${jobTitle} position${
        companyInfo ? ' at ' + companyInfo : ''
      }${requirements ? '. Required qualifications and details: ' + requirements : ''}. Include sections for: job description, responsibilities, required qualifications, preferred qualifications, benefits, and how to apply.`;

      const response = await fetch(`${BACKEND_URL}/hr-agent/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDebugInfo(prev => prev + '\nReceived response successfully!');

      setResult({
        id: Date.now().toString(),
        content: data.answer || "Sorry, I couldn't generate the job posting at this time.",
        timestamp: new Date(),
      });

    } catch (error) {
      console.error("Error generating job posting:", error);
      setDebugInfo(prev => prev + `\nError: ${error instanceof Error ? error.message : String(error)}`);
      setError("Failed to generate job posting. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug panel for development
  const showDebugPanel = process.env.NODE_ENV === 'development';

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Authentication check */}
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      {/* Header */}
      <div className="bg-[#111] border-b border-gray-800 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Job Posting Generator</h1>
          <span className="bg-[#1a1a2e] text-blue-400 text-xs px-2 py-1 rounded-full font-medium border border-blue-900">HR Assistant</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 p-6">
        {/* Input Form */}
        <div className="w-full md:w-1/3 bg-[#111] rounded-lg border border-gray-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Information (Optional)
              </label>
              <input
                type="text"
                value={companyInfo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyInfo(e.target.value)}
                placeholder="e.g. Company name, location, industry"
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements & Details
              </label>
              <textarea
                value={requirements}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRequirements(e.target.value)}
                placeholder="Enter key requirements, skills, experience levels, and any specific details about the role"
                rows={4}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reference Documents (Optional)
              </label>
              <input
                type="file"
                multiple
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles(e.target.files)}
                className="w-full bg-[#1a1a2e] border border-gray-700 rounded-lg px-4 py-2.5 text-white cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload similar job descriptions or company guidelines
              </p>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full rounded-lg px-4 py-2.5 font-medium ${
                isLoading
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating...
                </div>
              ) : (
                "Generate Job Posting"
              )}
            </button>
          </form>
        </div>

        {/* Result Display */}
        <div className="flex-1 bg-[#111] rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Generated Job Posting</h2>
          
          <div className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-6 min-h-[500px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                <p>Generating your job posting...</p>
              </div>
            ) : result ? (
              <div 
                ref={resultRef}
                className={`text-white ${styles.hrAgentContent}`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(result.content) }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Your generated job posting will appear here</p>
                <p className="text-sm mt-2">Complete the form to create a professional job posting</p>
              </div>
            )}
          </div>
          
          {result && (
            <div className="mt-4 text-xs text-gray-500">
              Generated at: {result.timestamp.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {showDebugPanel && debugInfo && (
        <div className="fixed bottom-0 right-0 bg-gray-800 text-xs text-white p-2 max-w-sm max-h-32 overflow-auto opacity-75">
          <pre>{debugInfo}</pre>
        </div>
      )}
    </div>
  );
}
