import Card from '../../components/Card';

export default function RecentActivityCard() {
  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
        <span className="mr-2">🔔</span>
        Recent Activity
      </h2>
      <div className="space-y-4">
        <div className="p-3 bg-[#1A1A1A] rounded-lg">
          <p className="text-sm text-gray-300">New application received for Senior Developer</p>
          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
        </div>
        <div className="p-3 bg-[#1A1A1A] rounded-lg">
          <p className="text-sm text-gray-300">Performance review cycle starting next week</p>
          <p className="text-xs text-gray-500 mt-1">1 day ago</p>
        </div>
        <div className="p-3 bg-[#1A1A1A] rounded-lg">
          <p className="text-sm text-gray-300">3 interviews scheduled for tomorrow</p>
          <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
        </div>
      </div>
    </Card>
  );
} 