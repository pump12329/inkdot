# InkDot 创意创作平台架构文档

> **文档版本**：v1.2.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 目录
- [项目愿景](#项目愿景)
- [核心原则](#核心原则)
- [技术架构](#技术架构)
- [创作模式](#创作模式)
- [开发工具](#开发工具)
- [实施计划](#实施计划)
- [关键洞察](#关键洞察)

## 🎯 项目愿景

### 核心理念
以**思维导图为核心载体**，借助AI实现多种创作功能，打造一个灵活、可扩展的创意创作平台。

### 目标功能
- **小说创作**：情节生成、角色管理、世界观构建
- **跑团模式**：GM助手、随机事件、规则解释
- **文字冒险**：剧情分支、选择系统、结局管理

### 设计哲学
- AI Agent作为**真正的创作伙伴**，而非简单工具
- 通过**插件系统**支持不同的创作需求
- 保持**简单性**与**可扩展性**的平衡

## 🏗️ 核心原则

### 1. 简单性
- 避免过度工程化
- 架构要符合实际需求
- 避免一次性过度设计

### 2. 统一性
- 插件开发需要统一的标准、API、架构
- 所有Agent都要遵循统一的接口规范
- **"一个标准，所有功能"** - 这是解决复杂性的关键

### 3. 可扩展性
- 支持多种创作模式
- 通过插件系统实现无限扩展
- 保持架构的灵活性

### 4. 渐进性
- 先实现核心功能，逐步添加创作模式
- 渐进式添加项目规则，避免过度约束
- 逐步完善，避免一次性过度设计

### 5. 职责分离
- 各组件各司其职，共同构建强大平台
- 平衡自由度与复杂度

## 🔧 技术架构

### 四层架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    前端层 (Frontend)                         │
├─────────────────────────────────────────────────────────────┤
│  Vue 3 + TypeScript  │  思维导图编辑器 + Workspace  │
├─────────────────────────────────────────────────────────────┤
│                    核心层 (Core)                            │
├─────────────────────────────────────────────────────────────┤
│  思维导图引擎  │  Workspace管理  │  Agent运行时  │  插件管理器  │
├─────────────────────────────────────────────────────────────┤
│                    AI集成层 (AI Integration)                 │
├─────────────────────────────────────────────────────────────┤
│  LangChain Agents  │  MCP服务  │  OpenAI API  │  n8n工作流  │
├─────────────────────────────────────────────────────────────┤
│                    服务层 (Services)                        │
├─────────────────────────────────────────────────────────────┤
│  Node.js API  │  SQLite  │  文件存储  │  SDK工具  │
└─────────────────────────────────────────────────────────────┘
```

### 核心组件

#### 1. 思维导图引擎
- **职责**：节点管理、连接关系、数据存储、创作模式集成
- **特点**：简单、高效、可扩展、模式切换
- **技术**：Vue 3 + Canvas/SVG + 创作模式组件

#### 2. Workspace管理
- **职责**：工作区管理、多项目切换、布局管理
- **特点**：多标签页、拖拽排序、快速切换
- **技术**：Vue 3 + 状态管理 + 本地存储

#### 3. Agent运行时
- **职责**：AI Agent生命周期管理、任务调度
- **特点**：统一接口、易于扩展
- **技术**：LangChain + 自定义运行时

#### 4. 插件管理器
- **职责**：插件加载、热插拔、API管理
- **特点**：SDK支持、MCP集成
- **技术**：自定义插件系统 + MCP服务

#### 5. 数据存储
- **职责**：项目保存、版本管理、配置存储
- **特点**：SQLite + JSON、本地优先
- **技术**：SQLite + 文件系统

### 统一接口设计

```typescript
// Agent统一接口
interface Agent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  execute(input: AgentInput): Promise<AgentOutput>;
}

// 统一输入输出格式
interface AgentInput {
  type: 'text' | 'mindmap' | 'file';
  content: any;
  context?: Record<string, any>;
  mode: 'novel' | 'rpg' | 'adventure' | 'general';
}

interface AgentOutput {
  success: boolean;
  result: any;
  suggestions?: string[];
  metadata?: Record<string, any>;
}

// 思维导图节点
interface MindMapNode {
  id: string;
  content: string;
  position: { x: number; y: number };
  connections: string[];
  metadata: Record<string, any>;
  // 节点基础类型（通用）
  type: 'text' | 'image' | 'link' | 'note' | 'custom';
  // 节点标签（用于分类和搜索）
  tags: string[];
  // 节点样式
  style?: {
    color?: string;
    shape?: 'circle' | 'rectangle' | 'diamond' | 'custom';
    size?: 'small' | 'medium' | 'large';
  };
  // 节点编辑状态
  editing?: {
    isEditing: boolean; // 是否正在编辑
    editMode: 'text' | 'command' | 'ai'; // 编辑模式
    commandHistory: string[]; // 指令历史
    lastCommand?: string; // 最后执行的指令
  };
  // 节点级AI功能
  ai?: {
    suggestions: string[]; // AI建议
    generatedContent: string[]; // AI生成的内容
    analysis: NodeAnalysis; // 节点分析结果
    lastAIAction: string; // 最后一次AI操作
    aiEnabled: boolean; // 是否启用AI功能
    aiModel: string; // 当前使用的AI模型
    prompt: string; // 当前AI提示词
  };
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

// 思维导图项目
interface MindMapProject {
  id: string;
  name: string;
  description: string;
  // 创作模式类型
  mode: 'novel' | 'rpg' | 'adventure' | 'general';
  // 项目配置
  config: {
    nodeTypes: string[]; // 可用的节点类型
    aiEnabled: boolean;
    plugins: string[];
  };
  // 思维导图数据
  nodes: MindMapNode[];
  // 创作模式特定配置
  modeConfig?: {
    novel?: {
      characterTemplates?: Record<string, any>;
      plotStructures?: string[];
    };
    rpg?: {
      ruleSystems?: string[];
      diceTypes?: string[];
    };
    adventure?: {
      choiceTypes?: string[];
      endingTypes?: string[];
    };
  };
}

// Workspace工作区
interface Workspace {
  id: string;
  name: string;
  description: string;
  // 工作区配置
  config: {
    layout: 'single' | 'split' | 'grid' | 'custom';
    theme: 'light' | 'dark' | 'auto';
    autoSave: boolean;
    syncEnabled: boolean;
  };
  // 项目列表
  projects: MindMapProject[];
  // 当前活动项目
  activeProjectId: string;
  // 工作区状态
  state: {
    isDirty: boolean;
    lastSaved: Date;
    unsavedChanges: string[];
  };
  // 布局信息（精简）
  layout?: {
    tabs: WorkspaceTab[];
    sidebar: SidebarConfig;
    toolbar: ToolbarConfig;
    splitter: SplitterConfig;
  };
}

// 工作区标签页
interface WorkspaceTab {
  id: string;
  projectId: string;
  name: string;
  isActive: boolean;
  isDirty: boolean;
  position: number;
}

// 工作区面板（精简）
interface WorkspacePanel {
  id: string;
  type: 'projects' | 'ai';
  visible: boolean;
  size: number;
  // AI面板配置
  aiMode?: 'chat' | 'agent';
}

// 分割器配置（精简）
interface SplitterConfig {
  sidebarWidth: number;
  collapsed: boolean;
}

// 侧边栏配置（精简）
interface SidebarConfig {
  panels: WorkspacePanel[];
  width: number;
  collapsed: boolean;
}

// 工具栏配置（精简）
interface ToolbarConfig {
  showSearch: boolean;
  showAI: boolean;
  showSettings: boolean;
}

// AI面板配置（精简）
interface AIPanelConfig {
  mode: 'chat' | 'agent';
  currentAgent?: string;
  history: ChatMessage[];
}

// 聊天消息（精简）
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 悬浮工具栏
interface FloatingToolbar {
  id: string;
  visible: boolean;
  position: { x: number; y: number };
  tools: ToolbarTool[];
  context: 'node' | 'canvas' | 'connection';
}

// 工具栏工具
interface ToolbarTool {
  id: string;
  type: 'button' | 'dropdown' | 'separator';
  label: string;
  icon: string;
  action: string;
  visible: boolean;
  disabled: boolean;
  // 工具分组
  group?: 'edit' | 'style' | 'ai' | 'connection' | 'view';
  // AI工具特殊配置
  aiConfig?: {
    requiresSelection: boolean; // 是否需要选中节点
    contextAware: boolean; // 是否基于上下文
    mode: 'generate' | 'analyze' | 'optimize' | 'suggest';
  };
}

// 右键菜单
interface ContextMenu {
  id: string;
  visible: boolean;
  position: { x: number; y: number };
  items: ContextMenuItem[];
  context: 'node' | 'canvas' | 'connection';
}

// 右键菜单项
interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string;
  action: string;
  shortcut?: string;
  visible: boolean;
  disabled: boolean;
  // 菜单分组
  group?: 'edit' | 'style' | 'ai' | 'connection' | 'view';
  // AI菜单项特殊配置
  aiConfig?: {
    requiresContent: boolean; // 是否需要节点内容
    contextAware: boolean; // 是否基于上下文
    mode: 'generate' | 'analyze' | 'optimize' | 'suggest';
  };
}

// 节点级AI操作
interface NodeAIAction {
  id: string;
  nodeId: string;
  action: 'generate' | 'analyze' | 'optimize' | 'suggest' | 'expand' | 'summarize';
  input: string;
  output: string;
  timestamp: Date;
  success: boolean;
  metadata?: Record<string, any>;
  // AI服务信息
  aiService: 'deepseek' | 'openrouter';
  model: string;
  cost?: number; // API调用成本
}

// AI服务配置
interface AIServiceConfig {
  deepseek: {
    apiKey: string;
    baseUrl: string;
    models: string[];
    defaultModel: string;
    enabled: boolean;
  };
  openrouter: {
    apiKey: string;
    baseUrl: string;
    models: string[];
    defaultModel: string;
    enabled: boolean;
  };
}

// AI模型信息
interface AIModel {
  id: string;
  name: string;
  provider: 'deepseek' | 'openrouter';
  description: string;
  maxTokens: number;
  costPerToken: number;
  capabilities: string[];
  enabled: boolean;
}

// 节点指令系统
interface NodeCommand {
  id: string;
  nodeId: string;
  command: string;
  type: 'ai' | 'operation' | 'style' | 'tag';
  parameters: Record<string, any>;
  result: any;
  timestamp: Date;
  success: boolean;
}

// 指令解析器
interface CommandParser {
  parse(input: string): ParsedCommand;
  execute(command: ParsedCommand, nodeId: string): Promise<CommandResult>;
  getSuggestions(input: string): string[];
}

// 解析后的指令
interface ParsedCommand {
  type: 'ai' | 'operation' | 'style' | 'tag';
  action: string;
  parameters: Record<string, any>;
  rawInput: string;
}

// 指令执行结果
interface CommandResult {
  success: boolean;
  result: any;
  message: string;
  suggestions?: string[];
}

// 插件接口
interface Plugin {
  id: string;
  name: string;
  version: string;
  hooks: PluginHook[];
  install(): Promise<void>;
  uninstall(): Promise<void>;
}

// MCP服务接口
interface MCPService {
  name: string;
  tools: MCPTool[];
  execute(tool: string, params: any): Promise<any>;
}
```

## 🎨 Workspace工作区设计（精简版）

### 界面布局
```
┌─────────────────────────────────────────────────────────────┐
│  工具栏  │  搜索  │  设置  │  AI  │
├─────────────────────────────────────────────────────────────┤
│ 侧边栏  │                    主编辑区                      │
│        │  ┌─────────────────────────────────────────────┐  │
│ 项目   │  │  项目1  │  项目2  │  项目3  │  +  │  │
│        │  ├─────────────────────────────────────────────┤  │
│ AI     │  │                                             │  │
│        │  │           思维导图编辑器                    │  │
│        │  │        ┌─────────────────┐                  │  │
│        │  │        │ 悬浮工具栏      │                  │  │
│        │  │        │ [编辑][样式][AI] │                  │  │
│        │  │        └─────────────────┘                  │  │
│        │  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 侧边栏设计（精简）
- **项目列表**：显示所有思维导图项目，支持快速切换
- **AI面板**：Chat和Agent切换
  - **Chat**：通用AI对话
  - **Agent**：专业创作助手
  - **模型选择**：DeepSeek、OpenRouter模型切换
  - **API配置**：API密钥和模型配置

### 主编辑区
- **标签页**：当前打开的思维导图项目
- **思维导图画布**：主要的编辑区域
  - **悬浮工具栏**：节点操作、连接、样式、AI等功能
  - **右键菜单**：节点和画布的上下文菜单
  - **快捷键**：常用操作的键盘快捷键
- **全屏模式**：隐藏侧边栏，专注编辑

### 顶部工具栏（精简）
- **工具栏**：新建、保存、撤销、重做
- **搜索**：快速搜索项目和节点
- **设置**：基本设置和偏好
- **AI**：快速访问AI功能

## 🎨 思维导图交互设计

### 节点编辑交互
- **直接点击编辑**：点击节点直接进入编辑模式
- **指令输入**：在节点内输入指令来操作节点
  - **AI指令**：@ai 生成内容、@expand 扩展节点、@analyze 分析节点
  - **操作指令**：/add 添加子节点、/connect 连接节点、/style 修改样式
  - **标签指令**：#tag 添加标签、#color 修改颜色、#shape 修改形状
- **悬浮工具栏**：节点选中时显示快捷工具

### 悬浮工具栏
- **节点选中时**：显示编辑、样式、AI、连接等工具
  - **AI工具**：节点内容生成、扩展、优化、分析
  - **智能建议**：基于节点内容提供相关建议
  - **标签生成**：自动生成节点标签
- **画布空白处**：显示新建节点、AI助手、视图等工具
- **连接线选中时**：显示编辑、删除、样式等工具
- **工具分组**：编辑、样式、AI、连接、视图等分组

### 右键菜单
- **节点右键**：编辑、删除、复制、样式、AI分析等
  - **AI分析**：分析节点内容，提供改进建议
  - **AI扩展**：基于节点内容生成相关内容
  - **AI优化**：优化节点内容的表达和结构
  - **AI标签**：自动生成相关标签
- **画布右键**：新建节点、粘贴、AI助手、视图设置等
- **连接线右键**：编辑、删除、样式等
- **快捷键支持**：常用操作支持键盘快捷键

### 创作模式（集成在思维导图中）

### 模式切换机制
- **项目创建时选择模式**：创建新项目时选择创作模式
- **项目设置中切换模式**：在项目设置中可以切换创作模式
- **节点标签系统**：通过标签系统管理不同类型的节点
- **上下文菜单**：右键节点显示对应项目模式的专用功能

### 小说创作模式
- **项目类型**：整个思维导图项目为小说创作模式
- **节点标签**：角色、情节、世界观、设定、灵感等标签
- **节点级AI功能**：
  - **角色节点**：AI分析角色性格、生成角色背景、建议角色发展
  - **情节节点**：AI生成情节发展、分析情节逻辑、建议情节转折
  - **世界观节点**：AI扩展世界观设定、生成相关细节、检查设定一致性
- **节点指令示例**：
  - **@ai 生成角色背景**：为角色节点生成详细背景
  - **@expand 扩展情节**：基于当前情节生成后续发展
  - **#tag 主角**：为节点添加主角标签
  - **/add 子节点**：添加子节点
- **关系管理**：通过节点连接和标签管理角色关系、情节时间线

### 跑团模式
- **项目类型**：整个思维导图项目为跑团模式
- **节点标签**：NPC、事件、规则、地点、物品、技能等标签
- **节点级AI功能**：
  - **NPC节点**：AI生成NPC性格、背景、对话风格
  - **事件节点**：AI生成随机事件、分析事件影响、建议后续发展
  - **规则节点**：AI解释规则、生成规则示例、建议规则调整
- **节点指令示例**：
  - **@ai 生成NPC对话**：为NPC节点生成对话内容
  - **@expand 随机事件**：生成随机事件
  - **#tag 重要NPC**：标记重要NPC
  - **/connect 相关事件**：连接相关事件节点
- **交互功能**：骰子工具、随机表、规则查询

### 文字冒险模式
- **项目类型**：整个思维导图项目为文字冒险模式
- **节点标签**：场景、选择、结局、角色、物品等标签
- **节点级AI功能**：
  - **场景节点**：AI生成场景描述、氛围营造、细节补充
  - **选择节点**：AI生成选择选项、分析选择后果、建议选择设计
  - **结局节点**：AI生成结局描述、分析结局合理性、建议结局调整
- **节点指令示例**：
  - **@ai 生成场景描述**：为场景节点生成详细描述
  - **@expand 选择选项**：为选择节点生成选项
  - **#tag 重要场景**：标记重要场景
  - **/add 分支结局**：添加分支结局
- **流程管理**：通过节点连接管理剧情分支和结局

## 🛠️ 开发工具

### 开发环境
- **Cursor Memory**：记录项目架构和技术决策
- **User Rules**：建立统一的代码风格和架构原则
- **Project Rules**：渐进式添加项目规则，避免过度约束

### AI服务配置
- **DeepSeek API**：主要AI服务提供商
  - 支持多种模型：DeepSeek-Chat、DeepSeek-Coder等
  - 成本效益高，适合大量文本生成
  - 支持中文优化
- **OpenRouter API**：备用AI服务提供商
  - 支持多种开源模型：Llama、Mistral、Claude等
  - 提供模型选择和成本对比
  - 支持模型切换和负载均衡

### 测试体系
- **完整测试覆盖**：单元测试、集成测试、端到端测试
- **AI辅助测试**：利用AI生成测试用例
- **自动化测试**：CI/CD集成，自动化测试执行

### 技术栈配置
- **前端**：Vue 3 + TypeScript + Pinia + Vite
- **后端**：Node.js + Express + Fastify
- **AI集成**：DeepSeek API + OpenRouter API + LangChain (简化版)
- **工作流**：n8n (轻量级集成)
- **存储**：SQLite + JSON文件 + 本地存储
- **插件**：自定义SDK + MCP服务

## 📅 简化实施计划

### 阶段1：基础框架 (2-3周)
1. **项目初始化**
   - 创建Vue 3 + TypeScript项目
   - 配置Vite + Pinia + 开发工具链
   - 集成现有墨点Logo组件

2. **核心引擎开发**
   - 实现思维导图引擎（基于Vue组件）
   - 创建统一Agent接口
   - 开发基础插件系统

3. **基础UI**
   - 基于墨点Logo创建组件库
   - 实现精简的Workspace工作区界面
   - 创建侧边栏（项目列表+AI面板）
   - 实现思维导图编辑器+悬浮工具栏
   - 创建右键菜单和快捷键系统
   - 创建标签页系统

### 阶段2：AI集成 (2-3周)
1. **AI服务集成**
   - 集成DeepSeek API和OpenRouter API
   - 实现AI服务配置和管理
   - 添加模型选择和切换功能

2. **LangChain集成**
   - 实现基础Agent框架
   - 创建小说创作Agent
   - 添加文本生成功能

3. **MCP服务**
   - 设置MCP服务器
   - 实现AI工具集成
   - 集成到Agent工作流

4. **创作模式集成**
   - 实现项目级别的创作模式选择
   - 添加节点标签系统和样式管理
   - 实现节点级AI功能集成
   - 实现节点指令系统和直接编辑功能
   - 添加AI工具栏和右键菜单

### 阶段3：扩展功能 (3-4周)
1. **更多创作模式**
   - 实现跑团模式项目类型和标签系统
   - 实现文字冒险模式项目类型和标签系统

2. **高级功能**
   - n8n工作流集成
   - 插件市场
   - 实时协作

3. **优化和测试**
   - 性能优化
   - 完整测试覆盖
   - 文档完善

## 💡 关键洞察

### 核心矛盾
> "要增加自由度，就需要暴露更多API，让管理和开发变得吃力"

### 解决方案
> "SDK + MCP服务" - 平衡自由度和复杂度的最佳方案

### 设计理念
> "一个标准，所有功能" - 所有Agent实现同一个接口，统一的输入输出格式

### 架构优势
- **职责分离**：各组件各司其职，避免功能重叠
- **统一标准**：降低学习成本，提高开发效率
- **渐进式开发**：每个阶段都有可用的产品
- **AI友好**：便于AI理解和操作

## 🎯 最终目标

构建一个**以思维导图为核心、AI Agent为创作伙伴、插件系统为扩展机制**的创意创作平台，通过**Vue 3前端 + Node.js后端 + LangChain Agent + MCP服务 + n8n工作流**的架构，既保持简单易用，又具备强大的扩展能力，同时通过渐进式规则和完整测试体系确保开发质量和可维护性。

---

## 📋 文档信息

| 属性 | 值 |
|------|----|
| 文档版本 | v1.2.0 |
| 创建时间戳 | T0 |
| 最后更新 | T1.5 |
| 状态 | 🟢 CURRENT |
| 维护者 | InkDot开发团队 |
| 审查周期 | T30 (月度) |
| 下次审查 | T31.5 |

### 📅 版本历史
- **v1.2.0** (T1.5) - 添加版本控制系统和时间戳格式
- **v1.1.0** (T1) - 完善AI集成和工作区设计，添加DeepSeek/OpenRouter支持
- **v1.0.0** (T0) - 初始架构设计，定义核心组件和接口

### 📝 变更说明
本文档记录InkDot平台的完整系统架构。如有重大变更，请及时更新版本号并记录变更内容。详细变更历史请参考 [CHANGELOG.md](../CHANGELOG.md)。
