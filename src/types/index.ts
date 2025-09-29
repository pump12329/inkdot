// MVP简化类型定义

// 位置坐标
export interface Position {
  x: number;
  y: number;
}

// 思维导图节点
export interface MindMapNode {
  id: string;
  content: string;
  position: Position;
  connections: string[];
}

// 节点连接
export interface NodeConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}
