# API服务层

## 📋 概述

API服务层提供后端API接口，包括项目管理、AI服务调用、数据同步等功能。

## 🎯 核心功能

### 项目API
- 项目CRUD操作
- 项目导入导出
- 项目版本管理

### AI服务API
- DeepSeek API集成
- OpenRouter API集成
- AI模型管理

### 数据同步
- 本地数据同步
- 云端数据备份
- 冲突解决

## 📁 文件结构

```
api/
├── README.md              # 本文件
├── api-client.ts          # API客户端
├── project-api.ts         # 项目相关API
├── ai-api.ts              # AI服务API
├── sync-api.ts            # 数据同步API
├── auth.ts                # 认证相关
└── types.ts               # API类型定义
```

## 🔧 核心接口

### ApiClient
```typescript
interface ApiClient {
  // 基础配置
  setBaseURL(url: string): void;
  setAuthToken(token: string): void;
  
  // 请求方法
  get<T>(endpoint: string, params?: Record<string, any>): Promise<T>;
  post<T>(endpoint: string, data?: any): Promise<T>;
  put<T>(endpoint: string, data?: any): Promise<T>;
  delete<T>(endpoint: string): Promise<T>;
}
```

### ProjectAPI
```typescript
interface ProjectAPI {
  // 项目操作
  createProject(project: CreateProjectRequest): Promise<ProjectResponse>;
  getProject(id: string): Promise<ProjectResponse>;
  updateProject(id: string, updates: UpdateProjectRequest): Promise<ProjectResponse>;
  deleteProject(id: string): Promise<boolean>;
  listProjects(): Promise<ProjectListResponse>;
  
  // 导入导出
  exportProject(id: string, format: 'json' | 'md' | 'pdf'): Promise<Blob>;
  importProject(file: File): Promise<ProjectResponse>;
}
```

### AIAPI
```typescript
interface AIAPI {
  // AI服务调用
  generateText(prompt: string, options: AIGenerateOptions): Promise<string>;
  analyzeContent(content: string, type: 'sentiment' | 'complexity'): Promise<AIAnalysis>;
  suggestImprovements(content: string): Promise<string[]>;
  
  // 模型管理
  getAvailableModels(): Promise<AIModel[]>;
  setDefaultModel(provider: string, model: string): void;
}
```

## 🚀 使用示例

```typescript
import { ApiClient } from './api-client';
import { ProjectAPI } from './project-api';
import { AIAPI } from './ai-api';

// 初始化API客户端
const apiClient = new ApiClient();
apiClient.setBaseURL('http://localhost:3000/api');

// 项目API
const projectAPI = new ProjectAPI(apiClient);
const project = await projectAPI.createProject({
  name: '我的小说',
  mode: 'novel',
  description: '科幻小说创作'
});

// AI API
const aiAPI = new AIAPI(apiClient);
const generatedText = await aiAPI.generateText(
  '写一个科幻小说的开头',
  { model: 'deepseek-chat', maxTokens: 500 }
);
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
