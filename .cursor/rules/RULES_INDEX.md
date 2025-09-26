# 项目规则索引

本文档提供了 InkDot 项目所有规则文件的索引和描述，帮助开发者快速了解和使用项目规范。

## 📋 规则文件列表

### 核心规范 (alwaysApply: true)

| 文件名                       | 描述                                                                           | 适用场景               |
| ---------------------------- | ------------------------------------------------------------------------------ | ---------------------- |
| `project-info.mdc`           | 项目基本信息规范，包含项目概述、技术栈信息、版本管理、参考文档等项目信息指导   | 所有开发场景的基础信息 |
| `frontend-development.mdc`   | Vue 3 + TypeScript前端开发规范，包含代码规范、组件设计、样式规范等核心开发指导 | 所有前端开发工作       |
| `code-quality-standards.mdc` | ESLint代码质量标准，包含TypeScript规范、Vue组件质量要求、代码清理检查清单等    | 所有代码编写和审查     |

### 设计与架构规范 (alwaysApply: false)

| 文件名                            | 描述                                                             | 适用场景                   |
| --------------------------------- | ---------------------------------------------------------------- | -------------------------- |
| `architecture.mdc`                | 用于系统架构设计、技术选型、模块设计、重构等架构相关问题         | 架构设计、技术选型、重构   |
| `component-architecture.mdc`      | 用于Vue组件设计、组件通信、组件架构、组件重构等组件相关问题      | 组件设计、组件架构、重构   |
| `ui-design-system.mdc`            | 用于UI设计、界面布局、视觉规范、色彩系统、用户体验等设计相关问题 | UI设计、界面布局、视觉规范 |
| `interaction-patterns.mdc`        | 用于用户交互设计、操作体验、无障碍设计、用户行为等交互相关问题   | 交互设计、用户体验、无障碍 |
| `css-style-system.mdc`            | 用于CSS样式开发、样式架构、主题切换、响应式设计等样式相关问题    | CSS样式、主题系统、响应式  |
| `design-implementation-guide.mdc` | 用于设计实施、UI改造、界面重构、设计系统落地等设计实施相关问题   | 设计实施、UI改造、重构     |

### AI功能规范 (alwaysApply: false)

| 文件名               | 描述                                                        | 适用场景                      |
| -------------------- | ----------------------------------------------------------- | ----------------------------- |
| `ai-integration.mdc` | 用于AI功能开发、API集成、智能助手、机器学习功能等AI相关问题 | AI功能开发、API集成、智能助手 |

### 开发流程规范 (alwaysApply: false)

| 文件名                     | 描述                                                              | 适用场景                     |
| -------------------------- | ----------------------------------------------------------------- | ---------------------------- |
| `development-workflow.mdc` | 用于Git操作、开发流程、代码审查、版本管理、协作开发等流程相关问题 | Git操作、开发流程、协作      |
| `testing-standards.mdc`    | 用于测试编写、测试策略、质量保证、性能测试等测试相关问题          | 测试编写、质量保证、性能测试 |
| `mvp-development.mdc`      | 用于MVP规划、产品策略、功能优先级、敏捷开发等项目规划相关问题     | MVP规划、产品策略、敏捷开发  |

### 工具与管理规范 (alwaysApply: false)

| 文件名                        | 描述                                                             | 适用场景                       |
| ----------------------------- | ---------------------------------------------------------------- | ------------------------------ |
| `project-tools.mdc`           | 用于项目工具使用、npm命令、构建工具、开发环境配置等工具相关问题  | 工具使用、环境配置、构建部署   |
| `timestamp-system.mdc`        | 用于文档更新、时间戳管理、版本控制等文档管理相关问题             | 文档更新、时间戳管理、版本控制 |
| `documentation-structure.mdc` | 用于文档结构设计、文档组织、文档管理、文档规范等文档体系相关问题 | 文档结构、文档组织、文档管理   |

### 项目阶段规范 (alwaysApply: false)

| 文件名                    | 描述                                                | 适用场景                      |
| ------------------------- | --------------------------------------------------- | ----------------------------- |
| `initial-development.mdc` | 用于项目初始化、环境设置、MVP开发等项目启动相关问题 | 项目初始化、环境设置、MVP启动 |

## 🎯 规则使用指南

### Always Apply 规则 (核心必需)

这些规则在所有开发场景中都必须遵循：

- `project-info.mdc` - 项目基础信息
- `frontend-development.mdc` - 前端开发核心规范
- `code-quality-standards.mdc` - 代码质量标准

### Agent Requestable 规则 (按需调用)

这些规则根据用户请求的具体场景智能选择：

#### 设计类

- `ui-design-system.mdc` - UI设计、界面布局
- `css-style-system.mdc` - CSS样式、主题系统
- `interaction-patterns.mdc` - 交互设计、用户体验
- `design-implementation-guide.mdc` - 设计实施、UI改造

#### 架构类

- `architecture.mdc` - 系统架构、技术选型
- `component-architecture.mdc` - 组件设计、组件架构

#### 功能类

- `ai-integration.mdc` - AI功能开发、API集成
- `testing-standards.mdc` - 测试编写、质量保证
- `mvp-development.mdc` - MVP规划、产品策略

#### 流程类

- `development-workflow.mdc` - Git操作、开发流程
- `project-tools.mdc` - 工具使用、环境配置

#### 管理类

- `timestamp-system.mdc` - 文档更新、时间戳管理
- `documentation-structure.mdc` - 文档结构、文档组织
- `initial-development.mdc` - 项目初始化、环境设置

## 📚 如何使用规则

### 1. 查看可用规则

```bash
# 在 Cursor 中使用 fetch_rules 工具
fetch_rules(["initial-development"])
```

### 2. 规则优先级

1. **Core Rules** - 核心架构和开发规范 (最高优先级)
2. **Design Rules** - UI和交互设计规范
3. **Process Rules** - 开发流程和工具规范
4. **Info Rules** - 项目信息和文档规范

### 3. 规则更新

- 所有规则文件都包含版本信息和时间戳
- 使用 `npm run docs:update` 更新规则文档
- 重大变更需要更新 CHANGELOG.md

## 🔍 规则验证

开发者可以通过以下方式验证规则的遵循情况：

- ESLint 检查代码质量规范
- TypeScript 检查类型安全规范
- Prettier 检查代码格式规范
- 自定义工具检查项目规范

---

**创建时间**: 2025-09-25
**维护者**: InkDot 开发团队
**状态**: 🟢 CURRENT
