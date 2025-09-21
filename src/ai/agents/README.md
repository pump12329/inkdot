# AI Agents

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

AI Agents模块基于LangChain框架，提供统一的AI Agent接口和生命周期管理。

## 🎯 核心功能

### Agent管理
- Agent注册和发现
- Agent生命周期管理
- Agent能力查询

### 任务调度
- 异步任务执行
- 任务队列管理
- 错误处理和重试

### 统一接口
- 标准化的输入输出格式
- 跨Agent的兼容性
- 插件化扩展支持

## 📁 文件结构

```
agents/
├── README.md              # 本文件
├── agent-manager.ts       # Agent管理器
├── base-agent.ts          # 基础Agent类
├── novel-agent.ts         # 小说创作Agent
├── rpg-agent.ts           # 跑团Agent
├── adventure-agent.ts     # 文字冒险Agent
├── scheduler.ts           # 任务调度器
└── types.ts               # 类型定义
```

## 🔧 核心接口

### BaseAgent
```typescript
abstract class BaseAgent {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract capabilities: string[];
  
  abstract execute(input: AgentInput): Promise<AgentOutput>;
  
  // 通用方法
  validateInput(input: AgentInput): boolean;
  formatOutput(result: any): AgentOutput;
  handleError(error: Error): AgentOutput;
}
```

### AgentManager
```typescript
interface AgentManager {
  // Agent注册
  registerAgent(agent: BaseAgent): boolean;
  unregisterAgent(id: string): boolean;
  
  // Agent查询
  getAgent(id: string): BaseAgent | null;
  getAgentsByCapability(capability: string): BaseAgent[];
  getAllAgents(): BaseAgent[];
  
  // 任务执行
  executeTask(agentId: string, input: AgentInput): Promise<AgentOutput>;
  executeTaskAsync(agentId: string, input: AgentInput): Promise<string>;
  getTaskResult(taskId: string): Promise<AgentOutput | null>;
}
```

## 🚀 使用示例

```typescript
import { AgentManager } from './agent-manager';
import { NovelAgent } from './novel-agent';

const agentManager = new AgentManager();

// 注册Agent
const novelAgent = new NovelAgent();
agentManager.registerAgent(novelAgent);

// 执行任务
const result = await agentManager.executeTask('novel-agent', {
  type: 'text',
  content: '生成一个科幻小说的开头',
  context: { genre: 'sci-fi', length: 'short' },
  mode: 'novel'
});

console.log(result.result); // 生成的小说开头
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
