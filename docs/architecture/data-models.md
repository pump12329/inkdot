# 数据模型设计

> **文档版本**：v1.0.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本文档定义了InkDot项目的核心数据模型，包括数据库设计、数据结构和关系定义。

## 🗄️ 数据库设计

### 核心表结构

#### 项目表 (projects)
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('novel', 'rpg', 'adventure', 'general')),
  config TEXT, -- JSON配置
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 节点表 (nodes)
```sql
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  type TEXT NOT NULL DEFAULT 'text',
  tags TEXT, -- JSON数组
  style TEXT, -- JSON对象
  ai_data TEXT, -- JSON对象
  metadata TEXT, -- JSON对象
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

#### 连接表 (connections)
```sql
CREATE TABLE connections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  from_node_id TEXT NOT NULL,
  to_node_id TEXT NOT NULL,
  type TEXT DEFAULT 'default',
  style TEXT, -- JSON对象
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (from_node_id) REFERENCES nodes(id) ON DELETE CASCADE,
  FOREIGN KEY (to_node_id) REFERENCES nodes(id) ON DELETE CASCADE
);
```

#### AI操作记录表 (ai_actions)
```sql
CREATE TABLE ai_actions (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  input_text TEXT NOT NULL,
  output_text TEXT NOT NULL,
  ai_service TEXT NOT NULL,
  model_name TEXT NOT NULL,
  cost REAL,
  success BOOLEAN NOT NULL,
  metadata TEXT, -- JSON对象
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);
```

### 索引设计
```sql
-- 项目查询优化
CREATE INDEX idx_projects_mode ON projects(mode);
CREATE INDEX idx_projects_updated_at ON projects(updated_at);

-- 节点查询优化
CREATE INDEX idx_nodes_project_id ON nodes(project_id);
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_nodes_position ON nodes(position_x, position_y);

-- 连接查询优化
CREATE INDEX idx_connections_project_id ON connections(project_id);
CREATE INDEX idx_connections_from_node ON connections(from_node_id);
CREATE INDEX idx_connections_to_node ON connections(to_node_id);

-- AI操作查询优化
CREATE INDEX idx_ai_actions_node_id ON ai_actions(node_id);
CREATE INDEX idx_ai_actions_service ON ai_actions(ai_service);
CREATE INDEX idx_ai_actions_created_at ON ai_actions(created_at);
```

## 📊 TypeScript 数据模型

### 核心接口定义

```typescript
// 基础类型
type NodeId = string;
type ProjectId = string;
type ConnectionId = string;

// 项目模式
type ProjectMode = 'novel' | 'rpg' | 'adventure' | 'general';

// AI服务提供商
type AIProvider = 'deepseek' | 'openrouter';

// 节点类型
type NodeType = 'text' | 'image' | 'link' | 'note' | 'custom';

// 项目接口
interface MindMapProject {
  id: ProjectId;
  name: string;
  description: string;
  mode: ProjectMode;
  config: ProjectConfig;
  createdAt: Date;
  updatedAt: Date;
}

// 项目配置
interface ProjectConfig {
  nodeTypes: NodeType[];
  aiEnabled: boolean;
  plugins: string[];
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  modeConfig?: ModeSpecificConfig;
}

// 模式特定配置
interface ModeSpecificConfig {
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

// 节点接口
interface MindMapNode {
  id: NodeId;
  projectId: ProjectId;
  content: string;
  position: Position;
  type: NodeType;
  tags: string[];
  style: NodeStyle;
  aiData?: NodeAIData;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// 位置信息
interface Position {
  x: number;
  y: number;
}

// 节点样式
interface NodeStyle {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  shape?: 'circle' | 'rectangle' | 'diamond' | 'custom';
  size?: 'small' | 'medium' | 'large';
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
}

// 节点AI数据
interface NodeAIData {
  suggestions: string[];
  generatedContent: string[];
  analysis?: NodeAnalysis;
  lastAIAction?: string;
  aiEnabled: boolean;
  aiModel?: string;
  prompt?: string;
}

// 节点分析结果
interface NodeAnalysis {
  sentiment?: 'positive' | 'negative' | 'neutral';
  complexity: 'simple' | 'medium' | 'complex';
  keywords: string[];
  suggestions: string[];
  relatedTopics: string[];
  quality: number; // 0-100
}

// 连接接口
interface NodeConnection {
  id: ConnectionId;
  projectId: ProjectId;
  fromNodeId: NodeId;
  toNodeId: NodeId;
  type: 'default' | 'arrow' | 'dashed' | 'custom';
  style: ConnectionStyle;
  createdAt: Date;
}

// 连接样式
interface ConnectionStyle {
  color?: string;
  width?: number;
  dashArray?: string;
  arrowType?: 'none' | 'arrow' | 'diamond';
}

// AI操作记录
interface AIActionRecord {
  id: string;
  nodeId: NodeId;
  actionType: 'generate' | 'analyze' | 'optimize' | 'suggest' | 'expand' | 'summarize';
  inputText: string;
  outputText: string;
  aiService: AIProvider;
  modelName: string;
  cost?: number;
  success: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
}
```

### 工作区数据模型

```typescript
// 工作区配置
interface WorkspaceConfig {
  id: string;
  name: string;
  description: string;
  layout: WorkspaceLayout;
  projects: ProjectId[];
  activeProjectId?: ProjectId;
  settings: WorkspaceSettings;
}

// 工作区布局
interface WorkspaceLayout {
  sidebar: SidebarConfig;
  toolbar: ToolbarConfig;
  tabs: TabConfig[];
  splitter: SplitterConfig;
}

// 侧边栏配置
interface SidebarConfig {
  width: number;
  collapsed: boolean;
  panels: PanelConfig[];
  activePanel: string;
}

// 面板配置
interface PanelConfig {
  id: string;
  type: 'projects' | 'ai' | 'outline' | 'properties';
  visible: boolean;
  size: number;
  config?: Record<string, any>;
}

// 工具栏配置
interface ToolbarConfig {
  showSearch: boolean;
  showAI: boolean;
  showSettings: boolean;
  customButtons: ToolbarButton[];
}

// 工具栏按钮
interface ToolbarButton {
  id: string;
  label: string;
  icon: string;
  action: string;
  visible: boolean;
}

// 标签页配置
interface TabConfig {
  id: string;
  projectId: ProjectId;
  name: string;
  isActive: boolean;
  isDirty: boolean;
  position: number;
}

// 工作区设置
interface WorkspaceSettings {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  autoSaveInterval: number; // 秒
  maxUndoSteps: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
}
```

### AI服务数据模型

```typescript
// AI服务配置
interface AIServiceConfig {
  deepseek: AIProviderConfig;
  openrouter: AIProviderConfig;
}

// AI提供商配置
interface AIProviderConfig {
  apiKey: string;
  baseUrl: string;
  models: AIModelInfo[];
  defaultModel: string;
  enabled: boolean;
  rateLimits: RateLimitConfig;
}

// AI模型信息
interface AIModelInfo {
  id: string;
  name: string;
  provider: AIProvider;
  description: string;
  maxTokens: number;
  costPerToken: number;
  capabilities: AICapability[];
  enabled: boolean;
}

// AI能力
type AICapability = 'text-generation' | 'text-analysis' | 'code-generation' | 'translation' | 'summarization';

// 速率限制配置
interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute: number;
  maxConcurrentRequests: number;
}

// AI请求
interface AIRequest {
  id: string;
  nodeId: NodeId;
  prompt: string;
  model: string;
  provider: AIProvider;
  options: AIRequestOptions;
  timestamp: Date;
}

// AI请求选项
interface AIRequestOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
  context?: string[];
}

// AI响应
interface AIResponse {
  id: string;
  requestId: string;
  content: string;
  usage: TokenUsage;
  model: string;
  provider: AIProvider;
  success: boolean;
  error?: string;
  timestamp: Date;
}

// Token使用情况
interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}
```

## 🔄 数据流设计

### 数据操作流程

```typescript
// 数据服务接口
interface DataService {
  // 项目操作
  createProject(project: Omit<MindMapProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<MindMapProject>;
  getProject(id: ProjectId): Promise<MindMapProject | null>;
  updateProject(id: ProjectId, updates: Partial<MindMapProject>): Promise<MindMapProject>;
  deleteProject(id: ProjectId): Promise<boolean>;
  listProjects(): Promise<MindMapProject[]>;

  // 节点操作
  createNode(node: Omit<MindMapNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<MindMapNode>;
  getNode(id: NodeId): Promise<MindMapNode | null>;
  updateNode(id: NodeId, updates: Partial<MindMapNode>): Promise<MindMapNode>;
  deleteNode(id: NodeId): Promise<boolean>;
  getProjectNodes(projectId: ProjectId): Promise<MindMapNode[]>;

  // 连接操作
  createConnection(connection: Omit<NodeConnection, 'id' | 'createdAt'>): Promise<NodeConnection>;
  deleteConnection(id: ConnectionId): Promise<boolean>;
  getProjectConnections(projectId: ProjectId): Promise<NodeConnection[]>;

  // AI操作记录
  recordAIAction(action: Omit<AIActionRecord, 'id' | 'createdAt'>): Promise<AIActionRecord>;
  getNodeAIHistory(nodeId: NodeId): Promise<AIActionRecord[]>;
}
```

### 缓存策略

```typescript
// 缓存配置
interface CacheConfig {
  projects: {
    ttl: number; // 缓存时间（秒）
    maxSize: number; // 最大缓存项目数
  };
  nodes: {
    ttl: number;
    maxSize: number;
  };
  aiResponses: {
    ttl: number;
    maxSize: number;
  };
}

// 缓存键策略
const CacheKeys = {
  project: (id: ProjectId) => `project:${id}`,
  projectNodes: (id: ProjectId) => `project:${id}:nodes`,
  projectConnections: (id: ProjectId) => `project:${id}:connections`,
  nodeAIHistory: (id: NodeId) => `node:${id}:ai-history`,
  aiModel: (provider: AIProvider, model: string) => `ai:${provider}:${model}`,
} as const;
```

## 📈 数据迁移

### 版本控制

```typescript
// 数据版本
interface DataVersion {
  version: string;
  description: string;
  migrations: Migration[];
  createdAt: Date;
}

// 迁移脚本
interface Migration {
  id: string;
  version: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

// 迁移示例
const migrations: Migration[] = [
  {
    id: '001_initial_schema',
    version: '1.0.0',
    description: '创建初始数据库结构',
    up: async () => {
      // 创建表的SQL语句
    },
    down: async () => {
      // 删除表的SQL语句
    }
  },
  {
    id: '002_add_ai_data',
    version: '1.1.0',
    description: '添加AI数据字段',
    up: async () => {
      // ALTER TABLE 语句
    },
    down: async () => {
      // 回滚语句
    }
  }
];
```

---

## 📋 文档信息

| 属性 | 值 |
|------|----|  
| 文档版本 | v1.0.0 |
| 创建时间戳 | T1.5 |
| 最后更新 | T1.5 |
| 状态 | 🟢 CURRENT |
| 维护者 | InkDot开发团队 |
| 审查周期 | T30 (月度) |
| 下次审查 | T31.5 |

### 📅 版本历史
- **v1.0.0** (T1.5) - 初始数据模型设计，包含完整的数据库结构和TypeScript接口

### 📝 变更说明
本文档定义InkDot项目的核心数据模型。数据结构变更需要考虑向后兼容性和迁移策略。
