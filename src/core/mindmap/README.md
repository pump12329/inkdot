# 思维导图引擎

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

思维导图引擎是InkDot的核心组件，负责节点管理、连接关系、数据存储和创作模式集成。

## 🎯 核心功能

### 节点管理
- 节点创建、更新、删除
- 节点类型管理（text, image, link, note, custom）
- 节点标签和分类
- 节点样式和主题

### 连接关系
- 节点间连接管理
- 连接类型和样式
- 连接验证和约束

### 数据存储
- 项目数据持久化
- 版本控制和历史记录
- 导入导出功能

### 创作模式集成
- 项目级创作模式
- 模式特定节点行为
- AI功能集成

## 📁 文件结构

```
mindmap/
├── README.md              # 本文件
├── engine.ts              # 思维导图引擎核心
├── node-manager.ts        # 节点管理器
├── connection-manager.ts  # 连接管理器
├── mode-handler.ts        # 创作模式处理器
├── storage.ts             # 数据存储
└── types.ts               # 类型定义
```

## 🔧 核心接口

### MindMapEngine
```typescript
interface MindMapEngine {
  // 节点操作
  createNode(data: Partial<MindMapNode>): MindMapNode;
  updateNode(id: string, updates: Partial<MindMapNode>): boolean;
  deleteNode(id: string): boolean;
  getNode(id: string): MindMapNode | null;
  
  // 连接操作
  createConnection(from: string, to: string): Connection;
  deleteConnection(id: string): boolean;
  
  // 项目操作
  createProject(data: Partial<MindMapProject>): MindMapProject;
  saveProject(project: MindMapProject): boolean;
  loadProject(id: string): MindMapProject | null;
  
  // 模式操作
  setMode(mode: ProjectMode): void;
  getModeConfig(): ModeSpecificConfig;
}
```

## 🚀 使用示例

```typescript
import { MindMapEngine } from './engine';

const engine = new MindMapEngine();

// 创建项目
const project = engine.createProject({
  name: '我的小说',
  mode: 'novel',
  description: '科幻小说创作'
});

// 创建节点
const node1 = engine.createNode({
  content: '主角设定',
  type: 'text',
  tags: ['character', 'protagonist']
});

const node2 = engine.createNode({
  content: '世界观',
  type: 'text',
  tags: ['world', 'setting']
});

// 创建连接
engine.createConnection(node1.id, node2.id);

// 保存项目
engine.saveProject(project);
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
