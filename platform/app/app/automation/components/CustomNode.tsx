import { Handle, Position, NodeProps } from 'reactflow';

export interface CustomNodeData {
  label: string;
  icon: string;
  actions: string[];
  isConfigured?: boolean;
  isConnected?: boolean;
  actionLabel?: string;
  actionDescription?: string;
  selectedAction?: string;
}

export default function CustomNode({ data, id }: NodeProps<CustomNodeData>) {
  const validationClass = !data.isConfigured ? 'border-red-500' : 'border-gray-800';
  const validationMessage = !data.isConfigured ? 'Configuration required' : '';
  const connectionMessage = !data.isConnected && id !== 'gmail-1' ? 'Connection required' : '';

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-[#1a1a2e] border ${validationClass} relative group`}>
      {(validationMessage || connectionMessage) && (
        <div className="absolute -top-8 left-0 right-0 text-center">
          <div className="text-xs text-red-400 bg-red-950/50 py-1 px-2 rounded-md inline-block">
            {validationMessage || connectionMessage}
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-2 h-2 !bg-blue-500 border-2 border-blue-900"
      />
      
      <div className="flex items-center">
        <div className="text-2xl mr-2">{data.icon}</div>
        <div className="flex-1">
          <div className="text-sm font-bold text-gray-200">{data.label}</div>
          {data.selectedAction ? (
            <div className="text-xs text-gray-400 mt-1">
              {data.selectedAction}
            </div>
          ) : data.actions && data.actions.length > 0 && (
            <div className="text-xs text-red-400 mt-1">
              Select an action
            </div>
          )}
          {data.actionLabel && (
            <div className="text-xs text-blue-400 mt-1">
              {data.actionLabel}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-2 h-2 !bg-blue-500 border-2 border-blue-900"
      />
    </div>
  );
} 