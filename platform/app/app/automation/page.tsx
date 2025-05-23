"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  OnConnect,
  ReactFlowProvider,
  useReactFlow,
  Panel,
  EdgeTypes,
  useKeyPress,
  MarkerType,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode, { CustomNodeData } from './components/CustomNode';
import CustomEdge from './components/CustomEdge';
import styles from './automation.module.css';
import AuthCheck from '@/app/components/AuthCheck';

// Custom Node Types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

// Custom Edge Types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Default edge options
const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#4a5568',
    strokeWidth: 2,
  },
};

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: string;
  actions: string[];
}

// Tool definitions
const availableTools: Tool[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    category: 'Communication',
    actions: ['Send Email', 'Read Email', 'Watch Inbox'],
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    category: 'Development',
    actions: ['Pull Repository', 'Create PR', 'Run Tests'],
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    category: 'Communication',
    actions: ['Send Message', 'Create Channel', 'Add Reaction'],
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: '📋',
    category: 'Project Management',
    actions: ['Create Issue', 'Update Status', 'Add Comment'],
  },
];

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const { screenToFlowPosition, getNodes, getEdges, setViewport, getViewport } = useReactFlow();
  const [debugMessage, setDebugMessage] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[]; viewport?: any }[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const ctrlPressed = useKeyPress('Control');
  const cmdPressed = useKeyPress('Meta');
  const zPressed = useKeyPress('z');
  const yPressed = useKeyPress('y');
  const shiftPressed = useKeyPress('Shift');

  // Configuration form state
  const [actionLabel, setActionLabel] = useState('');
  const [actionDescription, setActionDescription] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');

  // Save current state to history
  const saveToHistory = useCallback(() => {
    const currentState = {
      nodes: getNodes(),
      edges: getEdges(),
      viewport: getViewport(),
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      return [...newHistory, currentState];
    });
    setCurrentHistoryIndex((prev) => prev + 1);
  }, [getNodes, getEdges, currentHistoryIndex, getViewport]);

  // Handle undo/redo
  useEffect(() => {
    if ((ctrlPressed || cmdPressed) && zPressed) {
      if (shiftPressed) {
        // Redo
        if (currentHistoryIndex < history.length - 1) {
          const nextState = history[currentHistoryIndex + 1];
          setNodes(nextState.nodes);
          setEdges(nextState.edges);
          setViewport(nextState.viewport);
          setCurrentHistoryIndex(prev => prev + 1);
        }
      } else {
        // Undo
        if (currentHistoryIndex > 0) {
          const prevState = history[currentHistoryIndex - 1];
          setNodes(prevState.nodes);
          setEdges(prevState.edges);
          setViewport(prevState.viewport);
          setCurrentHistoryIndex(prev => prev - 1);
        }
      }
    }
  }, [ctrlPressed, cmdPressed, zPressed, shiftPressed, history, currentHistoryIndex, setNodes, setEdges, setViewport]);

  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent self-connections
      if (params.source === params.target) {
        return;
      }

      setDebugMessage(`Connecting nodes: ${params.source} -> ${params.target}`);
      
      const edge = {
        ...params,
        animated: true,
        style: {
          stroke: '#4a5568',
          strokeWidth: 2,
        },
        data: {
          label: '',
        },
      };

      setEdges((eds) => addEdge(edge, eds));
      
      // Mark nodes as connected
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === params.source || node.id === params.target) {
            return {
              ...node,
              data: {
                ...node.data,
                isConnected: true,
              },
            };
          }
          return node;
        })
      );
      
      saveToHistory();
    },
    [setEdges, setNodes, saveToHistory, setDebugMessage]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node<CustomNodeData>) => {
      setSelectedNode(node);
      setSelectedEdge(null);
      setActionLabel(node.data.actionLabel || '');
      setActionDescription(node.data.actionDescription || '');
      setSelectedAction(node.data.selectedAction || '');
    },
    []
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
      setEdgeLabel(edge.data?.label || '');
    },
    []
  );

  const updateNodeConfiguration = useCallback(() => {
    if (!selectedNode || !actionLabel || !actionDescription || !selectedAction) {
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              actionLabel,
              actionDescription,
              selectedAction,
              isConfigured: true,
            },
          };
        }
        return node;
      })
    );

    // Update connected edges with the label
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.source === selectedNode.id) {
          return {
            ...edge,
            label: actionLabel,
            data: {
              ...edge.data,
              label: actionLabel,
            },
          };
        }
        return edge;
      })
    );

    saveToHistory();
  }, [selectedNode, actionLabel, actionDescription, selectedAction, setNodes, setEdges, saveToHistory]);

  const updateEdgeLabel = useCallback((newLabel: string) => {
    setEdgeLabel(newLabel);
    setEdges((eds) =>
      eds.map((ed) =>
        ed.id === selectedEdge?.id
          ? {
              ...ed,
              label: newLabel,
              data: { ...ed.data, label: newLabel }
            }
          : ed
      )
    );
    saveToHistory();
  }, [selectedEdge, setEdges, saveToHistory]);

  // Add debug message display
  useEffect(() => {
    if (debugMessage) {
      console.log('Debug:', debugMessage);
    }
  }, [debugMessage]);

  // Initialize ReactFlow with default viewport
  useEffect(() => {
    setViewport({ x: 0, y: 0, zoom: 1 });
  }, [setViewport]);

  const onDragStart = useCallback((event: React.DragEvent, toolId: string) => {
    event.dataTransfer.setData('application/reactflow', toolId);
    event.dataTransfer.effectAllowed = 'move';
    setDebugMessage(`Started dragging tool: ${toolId}`);
    setIsDragging(true);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
    setDebugMessage('Dragging over drop area');
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const toolId = event.dataTransfer.getData('application/reactflow');
      
      setDebugMessage(`Drop event - toolId: ${toolId}, bounds: ${JSON.stringify(reactFlowBounds)}`);

      if (!toolId || !reactFlowBounds) {
        setDebugMessage('Missing toolId or bounds');
        return;
      }

      const tool = availableTools.find(t => t.id === toolId);
      if (!tool) {
        setDebugMessage('Tool not found');
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setDebugMessage(`Calculated position: ${JSON.stringify(position)}`);

      const newNode: Node<CustomNodeData> = {
        id: `${toolId}-${nodes.length + 1}`,
        type: 'custom',
        position,
        data: { label: tool.name, icon: tool.icon, actions: tool.actions },
        style: {
          background: '#1a1a2e',
          color: 'white',
          border: '1px solid #374151',
          borderRadius: '8px',
          padding: '12px',
          width: 180,
        },
      };

      setDebugMessage(`Creating new node: ${JSON.stringify(newNode)}`);
      setNodes((nds) => [...nds, newNode]);
      saveToHistory();
    },
    [nodes, setNodes, screenToFlowPosition, saveToHistory]
  );

  // Initialize history with empty state
  useEffect(() => {
    saveToHistory();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0A] text-white">
      {/* Authentication check */}
      <AuthCheck />
      
      {/* Header */}
      <div className="bg-[#111] border-b border-gray-800 shadow-sm py-4 px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center">
            Automation Builder
            <span className="ml-3 bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full">
              Beta
            </span>
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const flow = {
                  nodes: getNodes(),
                  edges: getEdges(),
                  viewport: getViewport(),
                };
                localStorage.setItem('automation-flow', JSON.stringify(flow));
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden h-[calc(100vh-5rem)]">
        {/* Tools Panel */}
        <div className="w-64 bg-[#111] border-r border-gray-800 p-4 overflow-y-auto">
          <h2 className="font-semibold mb-4 text-gray-300">Available Tools</h2>
          
          {Object.entries(
            availableTools.reduce<Record<string, Tool[]>>((acc, tool) => {
              acc[tool.category] = [...(acc[tool.category] || []), tool];
              return acc;
            }, {})
          ).map(([category, tools]) => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">{category}</h3>
              <div className="space-y-2">
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`${styles.dndNode} ${isDragging ? styles.dragging : ''}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, tool.id)}
                  >
                    <span className="mr-2 text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-300">{tool.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Flow Builder */}
        <div 
          ref={reactFlowWrapper} 
          className={`${styles.reactFlowWrapper} ${isDragging ? styles.dropTarget : ''}`}
          style={{ 
            width: '100%',
            height: '100%'
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            onDragOver={onDragOver}
            onDrop={onDrop}
            snapToGrid
            snapGrid={[16, 16]}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={4}
            className={styles.reactFlow}
            proOptions={{ hideAttribution: true }}
            connectOnClick={false}
          >
            <Controls />
            <MiniMap style={{ backgroundColor: '#111' }} />
            <Background color="#333" gap={16} variant={BackgroundVariant.Dots} />
            <Panel position="top-right" className="bg-[#111] p-2 rounded-lg border border-gray-800">
              <div className="text-xs text-gray-400 flex items-center gap-4">
                <div>
                  <span className="font-medium">Undo:</span> Ctrl/⌘ + Z
                </div>
                <div>
                  <span className="font-medium">Redo:</span> Ctrl/⌘ + Shift + Z
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>

        {/* Configuration Panel */}
        {(selectedNode || selectedEdge) && (
          <div className={styles.nodeConfigPanel}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-300">
                {selectedNode ? `Configure ${selectedNode.data.label}` : 'Configure Connection'}
              </h2>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setSelectedEdge(null);
                }}
                className="text-gray-500 hover:text-gray-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {selectedNode ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Action
                    </label>
                    <select
                      className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300"
                      value={selectedAction}
                      onChange={(e) => setSelectedAction(e.target.value)}
                    >
                      <option value="">Select an action</option>
                      {selectedNode.data.actions.map((action) => (
                        <option key={action} value={action}>
                          {action}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Label *
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300"
                      placeholder="Enter a label for this action"
                      value={actionLabel}
                      onChange={(e) => setActionLabel(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Description *
                    </label>
                    <textarea
                      className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300 min-h-[100px]"
                      placeholder="Describe what this action does..."
                      value={actionDescription}
                      onChange={(e) => setActionDescription(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={updateNodeConfiguration}
                    disabled={!actionLabel || !actionDescription || !selectedAction}
                    className={`w-full py-2 px-4 rounded-lg text-sm font-medium ${
                      !actionLabel || !actionDescription || !selectedAction
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Save Configuration
                  </button>
                </>
              ) : selectedEdge && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Connection Label
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#1a1a2e] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-300"
                      placeholder="Describe the data flow..."
                      value={edgeLabel}
                      onChange={(e) => updateEdgeLabel(e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Debug Panel */}
        {debugMessage && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg border border-gray-800 max-w-md z-50">
            <pre className="text-xs whitespace-pre-wrap">{debugMessage}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AutomationPage() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
