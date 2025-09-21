# InkDot 架构实现指南

## 📋 概述

本文档描述了如何根据架构设计实现InkDot项目的目录结构和模块组织。

## 🏗️ 架构映射

### 四层架构 → 目录结构

```
架构层                    → 目录结构
─────────────────────────────────────────
前端层 (Frontend)         → src/ui/
├── Vue 3 + TypeScript    → src/ui/components/
├── 思维导图编辑器        → src/ui/components/MindMap*
├── Workspace            → src/ui/components/Workspace*
└── 创作模式集成          → src/core/mindmap/

核心层 (Core)            → src/core/
├── 思维导图引擎          → src/core/mindmap/
├── Workspace管理        → src/core/workspace/
├── Agent运行时          → src/core/agent/
└── 插件管理器           → src/core/plugin-manager/

AI集成层 (AI Integration) → src/ai/
├── LangChain Agents     → src/ai/agents/
├── MCP服务              → src/ai/mcp/
├── DeepSeek API         → src/services/api/
└── OpenRouter API       → src/services/api/

服务层 (Services)        → src/services/
├── Node.js API          → src/services/api/
├── SQLite               → src/services/database/
├── 文件存储              → src/services/storage/
└── SDK工具              → src/plugins/sdk/
```

## 📁 详细目录结构

```
src/
├── index.ts                    # 主入口文件
├── types/                      # 全局类型定义
│   └── index.ts
├── utils/                      # 工具函数
├── assets/                     # 静态资源
│   ├── logo.svg
│   └── logo.css
├── styles/                     # 全局样式
├── ui/                         # 前端层
│   ├── components/             # Vue组件
│   │   ├── index.ts
│   │   ├── InkDotLogo.vue
│   │   ├── MindMapCanvas.vue
│   │   ├── MindMapNode.vue
│   │   ├── Workspace.vue
│   │   ├── AIPanel.vue
│   │   └── ...
│   ├── composables/            # 组合式函数
│   │   ├── index.ts
│   │   ├── useMindMap.ts
│   │   ├── useWorkspace.ts
│   │   ├── useAI.ts
│   │   └── ...
│   └── stores/                 # Pinia状态管理
│       ├── index.ts
│       ├── mindMapStore.ts
│       ├── workspaceStore.ts
│       └── ...
├── core/                       # 核心层
│   ├── mindmap/                # 思维导图引擎
│   │   ├── README.md
│   │   ├── engine.ts
│   │   ├── node-manager.ts
│   │   ├── connection-manager.ts
│   │   ├── mode-handler.ts
│   │   ├── storage.ts
│   │   └── types.ts
│   ├── workspace/              # 工作区管理
│   │   ├── README.md
│   │   ├── workspace-manager.ts
│   │   ├── layout-manager.ts
│   │   ├── tab-manager.ts
│   │   ├── state-manager.ts
│   │   └── types.ts
│   ├── agent/                  # Agent运行时
│   │   ├── agent-runtime.ts
│   │   ├── task-scheduler.ts
│   │   └── types.ts
│   └── plugin-manager/         # 插件管理器
│       ├── plugin-manager.ts
│       ├── plugin-loader.ts
│       └── types.ts
├── ai/                         # AI集成层
│   ├── agents/                 # AI Agents
│   │   ├── README.md
│   │   ├── agent-manager.ts
│   │   ├── base-agent.ts
│   │   ├── novel-agent.ts
│   │   ├── rpg-agent.ts
│   │   ├── adventure-agent.ts
│   │   ├── scheduler.ts
│   │   └── types.ts
│   ├── langchain/              # LangChain集成
│   │   ├── langchain-client.ts
│   │   ├── chain-manager.ts
│   │   └── types.ts
│   └── mcp/                    # MCP服务
│       ├── mcp-client.ts
│       ├── mcp-server.ts
│       └── types.ts
├── services/                   # 服务层
│   ├── api/                    # API服务
│   │   ├── README.md
│   │   ├── api-client.ts
│   │   ├── project-api.ts
│   │   ├── ai-api.ts
│   │   ├── sync-api.ts
│   │   ├── auth.ts
│   │   └── types.ts
│   ├── database/               # 数据库服务
│   │   ├── database-client.ts
│   │   ├── migration.ts
│   │   └── types.ts
│   └── storage/                # 存储服务
│       ├── file-storage.ts
│       ├── cloud-storage.ts
│       └── types.ts
└── plugins/                    # 插件系统
    ├── sdk/                    # 插件SDK
    │   ├── README.md
    │   ├── plugin-base.ts
    │   ├── plugin-manager.ts
    │   ├── mcp-client.ts
    │   ├── dev-tools.ts
    │   ├── examples/
    │   └── types.ts
    └── registry/               # 插件注册表
        ├── plugin-registry.ts
        ├── dependency-manager.ts
        └── types.ts
```

## 🔧 模块依赖关系

### 依赖层次
```
ui/ (前端层)
├── 依赖 core/ (核心层)
├── 依赖 ai/ (AI集成层)
└── 依赖 services/ (服务层)

core/ (核心层)
├── 依赖 services/ (服务层)
└── 依赖 plugins/ (插件系统)

ai/ (AI集成层)
├── 依赖 services/ (服务层)
└── 依赖 plugins/ (插件系统)

services/ (服务层)
└── 独立模块

plugins/ (插件系统)
└── 独立模块
```

### 导入规则
```typescript
// ✅ 正确的导入方式
// UI层可以导入所有其他层
import { MindMapEngine } from '@/core/mindmap'
import { AIAgent } from '@/ai/agents'
import { ApiClient } from '@/services/api'

// 核心层可以导入服务层和插件层
import { ApiClient } from '@/services/api'
import { PluginManager } from '@/plugins/sdk'

// ❌ 错误的导入方式
// 服务层不应该导入UI层
import { MindMapCanvas } from '@/ui/components' // ❌

// 核心层不应该导入UI层
import { useMindMap } from '@/ui/composables' // ❌
```

## 🚀 实现步骤

### 阶段1：核心模块 (T0 - T7)
1. **思维导图引擎** (`src/core/mindmap/`)
   - 实现基础节点管理
   - 实现连接关系管理
   - 实现数据存储

2. **工作区管理** (`src/core/workspace/`)
   - 实现多项目切换
   - 实现布局管理
   - 实现状态持久化

### 阶段2：AI集成 (T7 - T14)
1. **AI Agents** (`src/ai/agents/`)
   - 实现基础Agent接口
   - 实现小说创作Agent
   - 实现任务调度

2. **API服务** (`src/services/api/`)
   - 实现DeepSeek集成
   - 实现OpenRouter集成
   - 实现项目管理API

### 阶段3：UI组件 (T14 - T21)
1. **思维导图组件** (`src/ui/components/`)
   - 实现Canvas渲染
   - 实现节点交互
   - 实现连接绘制

2. **工作区组件** (`src/ui/components/`)
   - 实现多标签页
   - 实现侧边栏
   - 实现工具栏

### 阶段4：插件系统 (T21 - T28)
1. **插件SDK** (`src/plugins/sdk/`)
   - 实现插件接口
   - 实现热插拔
   - 实现MCP集成

2. **示例插件** (`src/plugins/sdk/examples/`)
   - 实现主题插件
   - 实现导出插件
   - 实现AI插件

## 📝 开发规范

### 文件命名
- 组件文件：`PascalCase.vue`
- 工具文件：`camelCase.ts`
- 类型文件：`types.ts`
- 配置文件：`config.ts`

### 导入导出
- 使用 `index.ts` 作为模块入口
- 使用命名导出而非默认导出
- 保持导入路径的一致性

### 类型定义
- 每个模块都有独立的 `types.ts`
- 全局类型定义在 `src/types/`
- 使用严格的TypeScript配置

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
