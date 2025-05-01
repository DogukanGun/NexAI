import Card from '../../components/Card';

export default function QuickActionsCard() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h2>
      <ul className="space-y-2">
        <li className="p-3 hover:bg-[#1A1A1A] rounded-lg cursor-not-allowed text-gray-500 transition-colors">
          <div className="flex items-center">
            <span className="mr-2">📋</span>
            Review Applications
            <span className="ml-2 bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800/50">
              Coming Soon
            </span>
          </div>
        </li>
        <li className="p-3 hover:bg-[#1A1A1A] rounded-lg cursor-not-allowed text-gray-500 transition-colors">
          <div className="flex items-center">
            <span className="mr-2">📊</span>
            Meeting Analysis
            <span className="ml-2 bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800/50">
              Coming Soon
            </span>
          </div>
        </li>
        <li className="p-3 hover:bg-[#1A1A1A] rounded-lg cursor-not-allowed text-gray-500 transition-colors">
          <div className="flex items-center">
            <span className="mr-2">👥</span>
            Employee Directory
            <span className="ml-2 bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800/50">
              Coming Soon
            </span>
          </div>
        </li>
        <li className="p-3 hover:bg-[#1A1A1A] rounded-lg cursor-pointer transition-colors">
          <a href="/app/chat" className="flex items-center text-gray-300">
            <span className="mr-2">🇩🇪</span>
            German HR Law Assistant
            <span className="ml-2 bg-blue-900/50 text-blue-300 text-xs px-2 py-1 rounded-full border border-blue-800/50">
              New
            </span>
          </a>
        </li>
      </ul>
    </Card>
  );
}
 