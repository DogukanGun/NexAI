export default function ApplicationCard() {
  return (
    <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] transition-colors">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Create Applications
          <span className="ml-3 inline-block bg-blue-900/50 text-blue-300 text-sm px-3 py-1 rounded-full border border-blue-800/50">
            Coming Soon
          </span>
        </h2>
        <p className="text-gray-400 text-lg mb-6">
          Creating job applications is now easier than ever before thanks to NexAI. Our intelligent platform helps you craft compelling job descriptions, manage applications, and find the perfect candidates - all in one place.
        </p>
        <button disabled className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 rounded-lg font-semibold cursor-not-allowed opacity-75">
          Get Started →
        </button>
      </div>
    </div>
  );
} 