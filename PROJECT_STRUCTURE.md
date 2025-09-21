# InkDot 项目结构

## 📋 概述

本文档描述了InkDot项目的完整目录结构和文件组织。

## 🏗️ 目录结构

```
inkdot/
├── .cursorrules                    # Cursor AI 开发规则
├── package.json                    # 项目配置和依赖
├── PROJECT_STRUCTURE.md           # 项目结构说明（本文件）
├── docs/                          # 📚 项目文档
│   ├── README.md                  # 文档导航中心
│   ├── CHANGELOG.md               # 变更日志
│   ├── TIMESTAMP_REFERENCE.md     # 时间戳参考
│   ├── architecture/              # 架构设计文档
│   │   ├── system-architecture.md
│   │   └── data-models.md
│   ├── development/               # 开发指南
│   │   ├── development-plan.md
│   │   ├── project-rules.md
│   │   ├── coding-standards.md
│   │   └── .idea                  # 项目想法记录
│   ├── design/                    # 设计规范
│   │   └── logo-specification.md
│   ├── tools/                     # 项目工具
│   │   ├── README.md
│   │   └── timestamp-helper.js
│   ├── api/                       # API文档（预留）
│   ├── user-guide/                # 用户指南（预留）
│   └── deployment/                # 部署文档（预留）
├── src/                           # 💻 源代码
│   ├── README.md                  # 源代码说明
│   ├── index.ts                   # 主入口文件
│   │
│   ├── core/                      # 🧠 核心引擎层
│   │   ├── mindmap/              # 思维导图引擎
│   │   │   ├── components/       # 思维导图组件
│   │   │   ├── composables/      # 思维导图组合式函数
│   │   │   ├── types/           # 思维导图类型定义
│   │   │   ├── utils/           # 思维导图工具函数
│   │   │   └── README.md        # 思维导图引擎说明
│   │   ├── workspace/           # 工作区管理引擎
│   │   │   ├── components/      # 工作区组件
│   │   │   ├── composables/     # 工作区组合式函数
│   │   │   ├── stores/         # 工作区状态管理
│   │   │   ├── types/          # 工作区类型定义
│   │   │   └── README.md       # 工作区管理说明
│   │   ├── agent/               # Agent运行时引擎
│   │   │   ├── runtime/        # Agent运行时
│   │   │   ├── types/          # Agent类型定义
│   │   │   └── utils/          # Agent工具函数
│   │   └── plugin-manager/     # 插件管理器
│   │       ├── loader/         # 插件加载器
│   │       ├── registry/       # 插件注册表
│   │       └── types/          # 插件类型定义
│   │
│   ├── ai/                       # 🤖 AI集成层
│   │   ├── agents/              # AI Agent实现
│   │   │   ├── novel/          # 小说创作Agent
│   │   │   ├── rpg/            # 跑团Agent
│   │   │   ├── adventure/      # 文字冒险Agent
│   │   │   ├── general/        # 通用Agent
│   │   │   └── README.md       # Agent说明
│   │   ├── langchain/          # LangChain集成
│   │   │   ├── base/           # 基础LangChain组件
│   │   │   ├── chains/         # LangChain链
│   │   │   └── tools/          # LangChain工具
│   │   ├── mcp/                # MCP服务集成
│   │   │   ├── client/         # MCP客户端
│   │   │   ├── server/         # MCP服务端
│   │   │   └── tools/          # MCP工具
│   │   └── services/           # AI服务
│   │       ├── deepseek/       # DeepSeek API集成
│   │       ├── openrouter/     # OpenRouter API集成
│   │       └── config/         # AI服务配置
│   │
│   ├── ui/                       # 🎨 前端UI层 (Vue 3)
│   │   ├── components/          # Vue组件
│   │   │   ├── mindmap/        # 思维导图组件
│   │   │   ├── workspace/      # 工作区组件
│   │   │   ├── toolbar/        # 工具栏组件
│   │   │   └── panels/         # 面板组件
│   │   ├── composables/         # Vue 3组合式函数
│   │   │   ├── mindmap/        # 思维导图组合式函数
│   │   │   ├── workspace/      # 工作区组合式函数
│   │   │   ├── ai/             # AI组合式函数
│   │   │   └── commands/       # 命令组合式函数
│   │   ├── stores/              # Pinia状态管理
│   │   │   ├── mindmap/        # 思维导图状态
│   │   │   ├── workspace/      # 工作区状态
│   │   │   ├── ai/             # AI状态
│   │   │   └── settings/       # 设置状态
│   │   ├── views/               # 页面视图
│   │   │   ├── home/           # 首页视图
│   │   │   ├── mindmap/        # 思维导图视图
│   │   │   ├── workspace/      # 工作区视图
│   │   │   └── settings/       # 设置视图
│   │   └── index.ts            # UI层导出
│   │
│   ├── services/                # 🔧 服务层
│   │   ├── api/                 # Node.js API服务
│   │   │   ├── routes/         # API路由
│   │   │   ├── middleware/     # 中间件
│   │   │   └── controllers/    # 控制器
│   │   ├── database/           # 数据库服务
│   │   │   ├── models/         # 数据模型
│   │   │   ├── migrations/     # 数据库迁移
│   │   │   └── queries/        # 查询构建器
│   │   ├── storage/            # 存储服务
│   │   │   ├── files/          # 文件存储
│   │   │   ├── projects/       # 项目存储
│   │   │   └── backups/        # 备份存储
│   │   └── sdk/                # SDK工具
│   │       ├── tools/          # SDK工具
│   │       ├── types/          # SDK类型
│   │       └── utils/          # SDK工具函数
│   │
│   ├── plugins/                 # 🔌 插件系统
│   │   ├── builtin/            # 内置插件
│   │   ├── external/           # 外部插件
│   │   ├── marketplace/        # 插件市场
│   │   └── sdk/                # 插件SDK
│   │       ├── types/          # 插件类型定义
│   │       ├── interfaces/     # 插件接口
│   │       └── utils/          # 插件工具函数
│   │
│   ├── types/                   # 📝 TypeScript类型定义
│   │   ├── index.ts            # 核心类型定义
│   │   ├── ai.ts               # AI相关类型
│   │   └── mindmap.ts          # 思维导图类型
│   │
│   ├── utils/                   # 🛠️ 工具函数
│   │   └── index.ts            # 工具函数导出
│   │
│   ├── assets/                  # 🎨 静态资源
│   │   ├── logo.svg            # Logo SVG文件
│   │   └── logo.css            # Logo样式文件
│   │
│   └── styles/                  # 💅 全局样式
├── tests/                         # 🧪 测试目录
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   ├── e2e/                      # 端到端测试
│   └── fixtures/                 # 测试数据
├── tools/                         # 🛠️ 开发工具
│   ├── build/                    # 构建工具
│   ├── dev/                      # 开发工具
│   └── scripts/                  # 脚本工具
├── examples/                     # 🎯 示例和演示
│   ├── README.md                 # 示例说明
│   ├── demo.html                 # 通用演示页面
│   ├── vue-demo.html             # Vue组件演示
│   └── test.html                 # 测试页面
└── demos/                        # 🚀 演示项目（预留）
```

## 📁 目录说明

### 📚 docs/ - 文档目录
- **architecture/** - 系统架构和技术设计文档
- **development/** - 开发流程、规范和计划文档
- **design/** - UI/UX设计规范和Logo规范
- **tools/** - 项目工具使用说明
- **api/** - API接口文档（待创建）
- **user-guide/** - 用户使用指南（待创建）
- **deployment/** - 部署运维文档（待创建）

### 💻 src/ - 源代码目录

#### 🧠 core/ - 核心引擎层
- **mindmap/** - 思维导图引擎：节点管理、连接关系、数据存储
- **workspace/** - 工作区管理：多项目切换、布局管理、状态同步
- **agent/** - Agent运行时：AI Agent生命周期管理、任务调度
- **plugin-manager/** - 插件管理器：插件加载、热插拔、API管理

#### 🤖 ai/ - AI集成层
- **agents/** - AI Agent实现：小说、跑团、文字冒险、通用Agent
- **langchain/** - LangChain集成：基础组件、链、工具
- **mcp/** - MCP服务集成：客户端、服务端、工具
- **services/** - AI服务：DeepSeek、OpenRouter API集成和配置

#### 🎨 ui/ - 前端UI层 (Vue 3)
- **components/** - Vue组件：思维导图、工作区、工具栏、面板组件
- **composables/** - Vue 3组合式函数：思维导图、工作区、AI、命令
- **stores/** - Pinia状态管理：思维导图、工作区、AI、设置状态
- **views/** - 页面视图：首页、思维导图、工作区、设置视图

#### 🔧 services/ - 服务层
- **api/** - Node.js API服务：路由、中间件、控制器
- **database/** - 数据库服务：数据模型、迁移、查询构建器
- **storage/** - 存储服务：文件、项目、备份存储
- **sdk/** - SDK工具：工具、类型、工具函数

#### 🔌 plugins/ - 插件系统
- **builtin/** - 内置插件：核心功能插件
- **external/** - 外部插件：第三方插件
- **marketplace/** - 插件市场：插件管理和分发
- **sdk/** - 插件SDK：类型定义、接口、工具函数

#### 📝 其他目录
- **types/** - TypeScript类型定义：核心、AI、思维导图类型
- **utils/** - 工具函数库：通用工具函数
- **assets/** - 静态资源文件：Logo、样式文件
- **styles/** - 全局样式文件：主题、组件样式

### 🎯 examples/ - 示例目录
- 包含各种演示和测试页面
- 展示组件使用方法和功能
- 用于开发和测试验证

### 🚀 demos/ - 演示项目目录
- 预留用于完整的演示项目
- 可以包含独立的演示应用

## 🔧 文件命名规范

### 组件文件
- Vue组件：`PascalCase.vue`
- React组件：`PascalCase.tsx` 或 `PascalCase.jsx`
- 组件导出：`index.ts`

### 工具文件
- 工具函数：`camelCase.ts`
- 类型定义：`camelCase.types.ts`
- 测试文件：`*.test.ts`

### 样式文件
- CSS文件：`kebab-case.css`
- 样式组件：`PascalCase.styles.ts`

### 文档文件
- 所有文档：`kebab-case.md`
- 使用描述性文件名

## 📋 开发工作流

### 1. 添加新Vue组件
```bash
# 在 src/ui/components/ 创建Vue组件
touch src/ui/components/mindmap/MindMapNode.vue

# 在对应的index.ts中导出
echo "export { default as MindMapNode } from './MindMapNode.vue'" >> src/ui/components/mindmap/index.ts

# 添加类型定义到对应的types目录
# 更新相关文档
```

### 2. 添加新工具函数
```bash
# 在 src/utils/ 创建工具函数
touch src/utils/newUtility.ts

# 添加类型定义
# 编写测试用例
# 更新文档
```

### 3. 更新文档
```bash
# 使用时间戳工具更新文档
npm run docs:update docs/README.md

# 记录变更到CHANGELOG
# 更新相关引用
```

## 🎯 最佳实践

### 文件组织
- 按功能模块组织文件
- 保持目录结构清晰
- 使用一致的命名规范

### 代码管理
- 遵循编码规范
- 使用TypeScript严格模式
- 保持代码简洁可读

### 文档维护
- 及时更新文档
- 使用时间戳系统
- 保持文档同步

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
