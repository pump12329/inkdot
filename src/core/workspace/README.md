# Workspace管理

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

Workspace管理模块负责工作区管理、多项目切换、布局管理，提供类似IDE的多标签页体验。

## 🎯 核心功能

### 工作区管理
- 多项目工作区
- 项目快速切换
- 工作区状态持久化

### 布局管理
- 可拖拽的面板布局
- 自定义工作区配置
- 响应式布局适配

### 标签页管理
- 多标签页支持
- 标签页拖拽排序
- 标签页状态管理

## 📁 文件结构

```
workspace/
├── README.md              # 本文件
├── workspace-manager.ts   # 工作区管理器
├── layout-manager.ts      # 布局管理器
├── tab-manager.ts         # 标签页管理器
├── state-manager.ts       # 状态管理器
└── types.ts               # 类型定义
```

## 🔧 核心接口

### WorkspaceManager
```typescript
interface WorkspaceManager {
  // 工作区操作
  createWorkspace(name: string): Workspace;
  switchWorkspace(id: string): boolean;
  getCurrentWorkspace(): Workspace | null;
  
  // 项目操作
  openProject(project: MindMapProject): Tab;
  closeProject(tabId: string): boolean;
  switchProject(tabId: string): boolean;
  
  // 布局操作
  setLayout(layout: WorkspaceLayout): void;
  getLayout(): WorkspaceLayout;
  resetLayout(): void;
}
```

### WorkspaceLayout
```typescript
interface WorkspaceLayout {
  sidebar: SidebarConfig;
  toolbar: ToolbarConfig;
  tabs: TabConfig[];
  splitter: SplitterConfig;
}
```

## 🚀 使用示例

```typescript
import { WorkspaceManager } from './workspace-manager';

const workspaceManager = new WorkspaceManager();

// 创建工作区
const workspace = workspaceManager.createWorkspace('我的创作空间');

// 打开项目
const tab = workspaceManager.openProject(project);

// 设置布局
workspaceManager.setLayout({
  sidebar: { width: 300, collapsed: false },
  toolbar: { showSearch: true, showAI: true },
  tabs: [tab],
  splitter: { position: 0.3 }
});
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
