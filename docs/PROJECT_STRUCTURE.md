# InkDot 项目结构

> **文档版本**：v2.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.15  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.15

## 📋 概述

本文档描述了InkDot项目的简化目录结构和文件组织。经过结构优化，项目现在采用扁平化的目录结构，减少了不必要的嵌套层级，提高了代码的可维护性和可读性。

## 🏗️ 简化后的目录结构

```
inkdot/
├── .cursor/                        # Cursor AI 规则配置
│   └── rules/                     # 开发规则文件
├── docs/                          # 📚 项目文档
│   ├── README.md                  # 文档导航中心
│   ├── CHANGELOG.md               # 变更日志
│   ├── architecture/              # 架构设计文档
│   ├── development/               # 开发指南
│   ├── design/                    # 设计规范
│   └── tools/                     # 项目工具
├── src/                           # 💻 源代码 (扁平化结构)
│   ├── components/                # 🎨 UI 组件
│   │   ├── common/               # 通用组件
│   │   ├── mindmap/              # 思维导图组件
│   │   ├── panels/               # 面板组件
│   │   ├── toolbar/              # 工具栏组件
│   │   ├── workspace/            # 工作区组件
│   │   ├── Button.vue            # 基础按钮组件
│   │   ├── Input.vue             # 基础输入框组件
│   │   ├── Modal.vue             # 模态框组件
│   │   └── MindMapCanvas.vue     # 思维导图画布
│   ├── views/                     # 📄 页面视图
│   │   ├── mindmap/              # 思维导图页面
│   │   ├── settings/             # 设置页面
│   │   └── workspace/            # 工作区页面
│   ├── stores/                    # 🗃️ 状态管理 (Pinia)
│   │   ├── mindmap/              # 思维导图状态
│   │   └── settings/             # 设置状态
│   ├── composables/               # 🔧 组合式函数
│   │   ├── ai/                   # AI 相关
│   │   ├── mindmap/              # 思维导图相关
│   │   └── workspace/            # 工作区相关
│   ├── services/                  # 🔧 服务层
│   │   ├── file-system/          # 文件系统服务
│   │   ├── project/              # 项目管理服务
│   │   └── storage/              # 存储服务
│   ├── ai/                        # 🤖 AI 功能
│   │   ├── agents/               # AI 代理
│   │   └── services/             # AI 服务
│   ├── mindmap/                   # 🧠 思维导图核心
│   │   └── components/           # 核心组件
│   ├── workspace/                 # 🏢 工作区核心
│   │   └── components/           # 核心组件
│   ├── plugins/                   # 🔌 插件系统
│   ├── types/                     # 📝 TypeScript 类型定义
│   ├── utils/                     # 🛠️ 工具函数
│   ├── config/                    # ⚙️ 配置文件
│   ├── assets/                    # 🎨 静态资源
│   ├── App.vue                    # 根组件
│   ├── main.ts                    # 应用入口
│   └── style.css                  # 全局样式
├── tests/                         # 🧪 测试目录
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── e2e/                      # 端到端测试
├── examples/                     # 🎯 示例代码
├── demos/                        # 🚀 演示项目
├── scripts/                      # 📜 构建脚本
├── tools/                        # 🛠️ 开发工具
├── public/                       # 🌐 公共资源
├── package.json                  # 项目配置
├── vite.config.ts                # Vite 配置
├── tsconfig.json                 # TypeScript 配置
└── eslint.config.js              # ESLint 配置
```

## 📁 目录详细说明

### 💻 src/ - 源代码目录 (扁平化结构)

#### 🎨 components/ - UI 组件

- **common/** - 通用组件 (ErrorBoundary, 基础组件等)
- **mindmap/** - 思维导图相关组件 (MindMapNode, MindMapCanvas等)
- **panels/** - 面板组件 (AIPanel, NodePropertiesPanel等)
- **toolbar/** - 工具栏组件
- **workspace/** - 工作区组件 (Workspace, WorkspaceSidebar等)
- **Button.vue** - 基础按钮组件
- **Input.vue** - 基础输入框组件
- **Modal.vue** - 模态框组件
- **MindMapCanvas.vue** - 思维导图画布组件

#### 📄 views/ - 页面视图

- **mindmap/** - 思维导图页面视图
- **settings/** - 设置页面视图
- **workspace/** - 工作区页面视图

#### 🗃️ stores/ - 状态管理 (Pinia)

- **mindmap/** - 思维导图相关状态
- **settings/** - 应用设置状态

#### 🔧 composables/ - 组合式函数

- **ai/** - AI 相关组合式函数
- **mindmap/** - 思维导图相关组合式函数
- **workspace/** - 工作区相关组合式函数

#### 🔧 services/ - 服务层

- **file-system/** - 文件系统服务
- **project/** - 项目管理服务
- **storage/** - 存储服务

#### 🤖 ai/ - AI 功能

- **agents/** - AI 代理实现
- **services/** - AI 服务集成

#### 🧠 mindmap/ - 思维导图核心

- **components/** - 思维导图核心组件

#### 🏢 workspace/ - 工作区核心

- **components/** - 工作区核心组件

#### 🔌 plugins/ - 插件系统

- 插件管理和加载相关功能

#### 📝 其他目录

- **types/** - TypeScript 类型定义
- **utils/** - 工具函数库
- **config/** - 配置文件
- **assets/** - 静态资源文件

### 🧪 tests/ - 测试目录

- **unit/** - 单元测试 (70%)
- **integration/** - 集成测试 (25%)
- **e2e/** - 端到端测试 (5%)

### 🎯 examples/ - 示例目录

- 包含各种演示和测试页面
- 展示组件使用方法和功能

### 🚀 demos/ - 演示项目目录

- 完整的演示项目

## 🔧 文件命名规范

### 组件文件

- Vue组件：`PascalCase.vue`
- 组件目录：`kebab-case/`

### 工具文件

- 工具函数：`camelCase.ts`
- 类型定义：`camelCase.ts`
- 测试文件：`*.test.ts`

### 样式文件

- CSS文件：`kebab-case.css`
- 全局样式：`style.css`

### 文档文件

- 所有文档：`kebab-case.md`
- 使用描述性文件名

## 🚀 结构优化说明

### ✅ 已完成的优化

1. **消除重复目录**
   - 合并 `src/ui/components/` → `src/components/`
   - 合并 `src/ui/stores/` → `src/stores/`
   - 合并 `src/ui/views/` → `src/views/`
   - 合并 `src/ui/composables/` → `src/composables/`

2. **扁平化结构**
   - 移除 `src/ui/` 中间层
   - 移除 `src/core/` 中间层
   - 将核心功能直接放在 `src/` 下

3. **优化导入路径**
   - `@/ui/components/` → `@/components/`
   - `@/ui/stores/` → `@/stores/`
   - `@/ui/views/` → `@/views/`
   - `@/ui/composables/` → `@/composables/`
   - `@/core/mindmap/` → `@/mindmap/`
   - `@/core/workspace/` → `@/workspace/`

4. **清理冗余文件**
   - 删除空的目录
   - 删除重复的文件

### 🎯 优化效果

- **减少嵌套层级**：从 4-5 层减少到 2-3 层
- **简化导入路径**：路径更短，更易维护
- **提高可读性**：结构更清晰，功能更明确
- **便于维护**：相关功能集中管理
- **符合约定**：遵循 Vue 3 项目最佳实践

## 📋 开发工作流

### 1. 添加新Vue组件

```bash
# 在 src/components/ 创建Vue组件
touch src/components/mindmap/NewComponent.vue

# 在对应的index.ts中导出
echo "export { default as NewComponent } from './NewComponent.vue'" >> src/components/mindmap/index.ts

# 添加类型定义到 src/types/
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

### 3. 添加新页面视图

```bash
# 在 src/views/ 创建页面视图
touch src/views/newPage/NewPageView.vue

# 添加路由配置
# 更新导航
```

### 4. 更新文档

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

### 导入路径规范

- 使用 `@/` 别名引用src目录
- 组件导入：`@/components/ComponentName`
- 视图导入：`@/views/ViewName`
- 状态导入：`@/stores/storeName`
- 工具导入：`@/utils/utilityName`

---

**文档版本**：v2.0.0  
**最后更新**：T0.4  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.4
