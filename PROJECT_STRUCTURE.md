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
│   ├── components/                # Vue/React组件
│   │   ├── index.ts              # 组件导出
│   │   ├── InkDotLogo.vue        # Vue Logo组件
│   │   ├── InkDotLogo.tsx        # React Logo组件
│   │   └── InkDotLogo.jsx        # JSX Logo组件
│   ├── composables/              # Vue 3 组合式函数
│   ├── stores/                   # Pinia状态管理
│   ├── types/                    # TypeScript类型定义
│   │   └── index.ts              # 核心类型定义
│   ├── utils/                    # 工具函数
│   ├── services/                 # API服务
│   ├── assets/                   # 静态资源
│   │   ├── logo.svg              # Logo SVG文件
│   │   └── logo.css              # Logo样式文件
│   └── styles/                   # 全局样式
├── examples/                     # 🎯 示例和演示
│   ├── README.md                 # 示例说明
│   ├── demo.html                 # 通用演示页面
│   ├── react-demo.html           # React组件演示
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
- **components/** - Vue 3和React组件
- **composables/** - Vue 3组合式函数
- **stores/** - Pinia状态管理
- **types/** - TypeScript类型定义
- **utils/** - 工具函数库
- **services/** - API服务层
- **assets/** - 静态资源文件
- **styles/** - 全局样式文件

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

### 1. 添加新组件
```bash
# 在 src/components/ 创建组件
touch src/components/NewComponent.vue

# 在 src/components/index.ts 中导出
echo "export { default as NewComponent } from './NewComponent.vue'" >> src/components/index.ts

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
