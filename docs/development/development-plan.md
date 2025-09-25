# InkDot 开发计划

> **文档版本**：v1.1.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 项目概述

**项目名称**：InkDot - 创意创作思维导图平台  
**开发周期**：7-10周  
**技术栈**：Vue 3 + TypeScript + Node.js + DeepSeek/OpenRouter AI  
**团队规模**：个人开发者

## 🎯 项目目标

构建一个**以思维导图为核心、AI Agent为创作伙伴、插件系统为扩展机制**的创意创作平台，支持小说创作、跑团、文字冒险等多种创作模式。

## 📅 开发阶段规划

### 阶段1：基础框架 (2-3周)

#### 第1周：项目初始化

**目标**：搭建基础开发环境和项目结构

**任务清单**：

- [ ] 创建Vue 3 + TypeScript项目
- [ ] 配置Vite + Pinia + 开发工具链
- [ ] 设置ESLint、Husky
- [ ] 集成现有墨点Logo组件
- [ ] 创建基础项目结构
- [ ] 配置Git仓库和CI/CD

**交付物**：

- 可运行的Vue项目
- 基础组件库
- 开发环境配置

#### 第2周：核心引擎开发

**目标**：实现思维导图核心功能

**任务清单**：

- [ ] 实现思维导图引擎（基于Vue组件）
- [ ] 创建节点管理系统
- [ ] 实现节点连接和拖拽功能
- [ ] 添加Canvas/SVG渲染支持
- [ ] 创建统一Agent接口
- [ ] 开发基础插件系统

**交付物**：

- 可编辑的思维导图
- 节点CRUD功能
- 基础插件架构

#### 第3周：基础UI

**目标**：完成Workspace工作区界面

**任务清单**：

- [ ] 基于墨点Logo创建组件库
- [ ] 实现Cursor风格的Workspace工作区界面
- [ ] 创建侧边栏（项目列表+AI面板）
- [ ] 实现思维导图编辑器+悬浮工具栏
- [ ] 创建右键菜单和快捷键系统
- [ ] 创建标签页系统

**交付物**：

- 完整的工作区界面
- 项目管理功能
- 基础交互系统

### 阶段2：AI集成 (2-3周)

#### 第4周：AI服务集成

**目标**：集成DeepSeek和OpenRouter AI服务

**任务清单**：

- [ ] 集成DeepSeek API
- [ ] 集成OpenRouter API
- [ ] 实现AI服务配置和管理
- [ ] 添加模型选择和切换功能
- [ ] 实现API密钥管理
- [ ] 添加成本监控功能

**交付物**：

- AI服务集成
- 模型选择界面
- API配置管理

#### 第5周：LangChain集成

**目标**：实现AI Agent框架

**任务清单**：

- [ ] 实现基础Agent框架
- [ ] 创建小说创作Agent
- [ ] 添加文本生成功能
- [ ] 实现Agent工作流
- [ ] 创建Agent管理界面

**交付物**：

- 可用的AI Agent
- 文本生成功能
- Agent管理系统

#### 第6周：MCP服务和创作模式

**目标**：完成AI功能集成

**任务清单**：

- [ ] 设置MCP服务器
- [ ] 实现AI工具集成
- [ ] 集成到Agent工作流
- [ ] 实现项目级别的创作模式选择
- [ ] 添加节点标签系统和样式管理
- [ ] 实现节点级AI功能集成
- [ ] 实现节点指令系统和直接编辑功能
- [ ] 添加AI工具栏和右键菜单

**交付物**：

- 完整的AI功能
- 创作模式系统
- 节点级AI操作

### 阶段3：扩展功能 (3-4周)

#### 第7周：更多创作模式

**目标**：实现跑团和文字冒险模式

**任务清单**：

- [ ] 实现跑团模式项目类型和标签系统
- [ ] 实现文字冒险模式项目类型和标签系统
- [ ] 添加模式特定的AI功能
- [ ] 实现模式切换和配置

**交付物**：

- 跑团创作模式
- 文字冒险模式
- 模式特定功能

#### 第8周：高级功能

**目标**：添加高级功能和优化

**任务清单**：

- [ ] n8n工作流集成
- [ ] 插件市场基础功能
- [ ] 实时协作基础功能
- [ ] 数据导入导出功能
- [ ] 性能优化

**交付物**：

- 工作流系统
- 插件市场
- 数据管理功能

#### 第9-10周：测试和完善

**目标**：完善功能和测试

**任务清单**：

- [ ] 完整测试覆盖
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 文档完善
- [ ] 部署准备

**交付物**：

- 完整的测试套件
- 优化的性能
- 完善的文档

## 🛠️ 技术实施细节

### 前端开发

```bash
# 项目初始化
npm create vue@latest inkdot
cd inkdot
npm install

# 安装依赖
npm install pinia @vueuse/core
npm install -D @types/node vite-plugin-eslint
```

### AI服务集成

```typescript
// DeepSeek API 集成
const deepseekConfig = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseUrl: 'https://api.deepseek.com/v1',
  models: ['deepseek-chat', 'deepseek-coder']
};

// OpenRouter API 集成
const openrouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY,
  baseUrl: 'https://openrouter.ai/api/v1',
  models: ['meta-llama/llama-2-70b-chat', 'mistralai/mistral-7b-instruct']
};
```

### 数据库设计

```sql
-- 项目表
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  mode TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 节点表
CREATE TABLE nodes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  content TEXT NOT NULL,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  type TEXT NOT NULL,
  tags TEXT, -- JSON array
  style TEXT, -- JSON object
  ai_data TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

## 📊 里程碑和检查点

### 里程碑1：基础框架完成 (第3周末)

- [ ] 可运行的思维导图编辑器
- [ ] 基础项目管理功能
- [ ] 完整的UI框架

### 里程碑2：AI功能完成 (第6周末)

- [ ] 集成AI服务
- [ ] 节点级AI操作
- [ ] 基础创作模式

### 里程碑3：功能完善 (第8周末)

- [ ] 多种创作模式
- [ ] 高级功能
- [ ] 性能优化

### 里程碑4：项目完成 (第10周末)

- [ ] 完整测试
- [ ] 文档完善
- [ ] 部署就绪

## 🎯 每日开发目标

### 每日工作量

- **开发时间**：6-8小时/天
- **代码提交**：至少1次/天
- **功能测试**：每个功能完成后立即测试
- **文档更新**：重要功能完成后更新文档

### 每周检查点

- **周一**：制定本周开发计划
- **周三**：中期进度检查和调整
- **周五**：周总结和下周规划
- **周日**：代码review和重构

## 🔧 开发工具和环境

### 开发环境

- **IDE**：Cursor
- **版本控制**：Git + GitHub
- **包管理**：pnpm
- **构建工具**：Vite
- **测试框架**：Vitest + Cypress

### AI辅助开发

- **Cursor AI**：代码生成和重构
- **GitHub Copilot**：代码补全
- **DeepSeek**：技术问题咨询
- **文档生成**：AI辅助文档编写

## 📋 任务管理

### 任务优先级

1. **P0 - 核心功能**：思维导图编辑、AI集成
2. **P1 - 重要功能**：创作模式、用户界面
3. **P2 - 增强功能**：高级功能、性能优化
4. **P3 - 可选功能**：插件市场、协作功能

### 风险管理

- **技术风险**：AI API限制、性能问题
- **时间风险**：功能复杂度超预期
- **质量风险**：测试覆盖不足

### 应对策略

- **技术风险**：提前测试API、性能监控
- **时间风险**：功能分期、MVP优先
- **质量风险**：持续测试、代码review

## 📈 成功指标

### 功能指标

- [ ] 思维导图编辑器正常工作
- [ ] AI功能响应时间 < 3秒
- [ ] 支持3种创作模式
- [ ] 节点级AI操作成功率 > 95%

### 性能指标

- [ ] 页面加载时间 < 2秒
- [ ] 1000个节点流畅操作
- [ ] 内存使用 < 500MB
- [ ] 移动端适配良好

### 用户体验指标

- [ ] 界面响应流畅
- [ ] 操作直观易懂
- [ ] 错误处理完善
- [ ] 帮助文档齐全

## 📚 学习和研究

### 技术学习

- [ ] Vue 3 Composition API深入
- [ ] TypeScript高级特性
- [ ] Canvas/SVG性能优化
- [ ] AI API最佳实践

### 竞品研究

- [ ] Miro思维导图功能
- [ ] Notion AI集成方式
- [ ] Obsidian插件系统
- [ ] Figma协作模式

## 🚀 部署和发布

### 部署环境

- **开发环境**：本地开发
- **测试环境**：Vercel/Netlify
- **生产环境**：云服务器

### 发布计划

- **Alpha版本**：第6周，内部测试
- **Beta版本**：第8周，小范围测试
- **正式版本**：第10周，公开发布

---

## 📋 文档信息

| 属性       | 值             |
| ---------- | -------------- |
| 文档版本   | v1.1.0         |
| 创建时间戳 | T0             |
| 最后更新   | T1.5           |
| 状态       | 🟢 CURRENT     |
| 维护者     | InkDot开发团队 |
| 审查周期   | T30 (月度)     |
| 下次审查   | T31.5          |

### 📅 版本历史

- **v1.1.0** (T1.5) - 添加版本控制系统和时间戳格式
- **v1.0.0** (T0) - 初始开发计划，包含三个主要阶段和详细任务

### 📝 变更说明

本文档提供结构化的开发路线图。随着项目进展，计划将根据实际情况调整，确保开发进度和质量。

_本开发计划将根据实际进度动态调整_
