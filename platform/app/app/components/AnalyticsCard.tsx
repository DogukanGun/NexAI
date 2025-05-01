import Card from '../../components/Card';

export default function AnalyticsCard() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">📈</span>
        Analytics Overview
      </h2>
      <div className="space-y-6">
        <div className="p-4 bg-[#1A1A1A] rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Open Positions</p>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            12
          </p>
        </div>
        <div className="p-4 bg-[#1A1A1A] rounded-lg">
          <p className="text-sm text-gray-400 mb-1">Active Applications</p>
          <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            48
          </p>
        </div>
      </div>
    </Card>
  );
} 