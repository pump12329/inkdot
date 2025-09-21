// InkDot 类型定义文件

// 重新导出所有类型
export * from './mindmap'
export * from './ai'

// 基础类型
export type NodeId = string;
export type ProjectId = string;
export type ConnectionId = string;

// 项目模式
export type ProjectMode = 'novel' | 'rpg' | 'adventure' | 'general';

// AI服务提供商
export type AIProvider = 'deepseek' | 'openrouter';

// 节点类型
export type NodeType = 'text' | 'image' | 'link' | 'note' | 'custom';

// 位置信息
export interface Position {
  x: number;
  y: number;
}

// 思维导图节点
export interface MindMapNode {
  id: NodeId;
  projectId: ProjectId;
  content: string;
  position: Position;
  type: NodeType;
  tags: string[];
  style?: NodeStyle;
  aiData?: NodeAIData;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 节点样式
export interface NodeStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  shape?: 'circle' | 'rectangle' | 'diamond' | 'custom';
  size?: 'small' | 'medium' | 'large';
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
}

// 节点AI数据
export interface NodeAIData {
  suggestions: string[];
  generatedContent: string[];
  analysis?: NodeAnalysis;
  lastAIAction?: string;
  aiEnabled: boolean;
  aiModel?: string;
  prompt?: string;
}

// 节点分析结果
export interface NodeAnalysis {
  sentiment?: 'positive' | 'negative' | 'neutral';
  complexity: 'simple' | 'medium' | 'complex';
  keywords: string[];
  suggestions: string[];
  relatedTopics: string[];
  quality: number; // 0-100
}

// 思维导图项目
export interface MindMapProject {
  id: ProjectId;
  name: string;
  description: string;
  mode: ProjectMode;
  config: ProjectConfig;
  nodes?: MindMapNode[];
  createdAt: Date;
  updatedAt: Date;
}

// 项目配置
export interface ProjectConfig {
  nodeTypes: NodeType[];
  aiEnabled: boolean;
  plugins: string[];
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  modeConfig?: ModeSpecificConfig;
}

// 模式特定配置
export interface ModeSpecificConfig {
  novel?: {
    characterTemplates: Record<string, any>;
    plotStructures: string[];
  };
  rpg?: {
    ruleSystems: string[];
    diceTypes: string[];
  };
  adventure?: {
    choiceTypes: string[];
    endingTypes: string[];
  };
}
