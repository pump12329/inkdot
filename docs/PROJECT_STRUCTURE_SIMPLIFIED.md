# InkDot 简化项目结构

## 📁 项目根目录

```
inkdot/
├── src/                    # 源代码目录
├── public/                 # 静态资源
├── docs/                   # 项目文档
├── tests/                  # 测试文件
├── examples/               # 示例代码
├── demos/                  # 演示项目
├── scripts/                # 构建脚本
├── tools/                  # 开发工具
├── .cursor/                # Cursor AI 规则
├── package.json            # 项目配置
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
└── eslint.config.js        # ESLint 配置
```

## 📁 源代码结构 (src/)

```
src/
├── components/             # UI 组件
│   ├── common/            # 通用组件
│   ├── mindmap/           # 思维导图组件
│   ├── panels/            # 面板组件
│   ├── toolbar/           # 工具栏组件
│   ├── workspace/         # 工作区组件
│   ├── Button.vue         # 基础按钮
│   ├── Input.vue          # 基础输入框
│   ├── Modal.vue          # 模态框
│   └── MindMapCanvas.vue  # 思维导图画布
├── views/                  # 页面视图
│   ├── mindmap/           # 思维导图页面
│   ├── settings/          # 设置页面
│   └── workspace/         # 工作区页面
├── stores/                 # 状态管理 (Pinia)
│   ├── mindmap/           # 思维导图状态
│   └── settings/          # 设置状态
├── composables/           # 组合式函数
│   ├── ai/                # AI 相关
│   ├── mindmap/           # 思维导图相关
│   └── workspace/         # 工作区相关
├── services/              # 服务层
│   ├── file-system/       # 文件系统服务
│   ├── project/           # 项目管理服务
│   └── storage/           # 存储服务
├── ai/                    # AI 功能
│   ├── agents/            # AI 代理
│   └── services/          # AI 服务
├── mindmap/               # 思维导图核心
│   └── components/        # 核心组件
├── workspace/             # 工作区核心
│   └── components/        # 核心组件
├── plugins/               # 插件系统
├── types/                 # TypeScript 类型定义
├── utils/                 # 工具函数
├── config/                # 配置文件
├── assets/                # 静态资源
├── App.vue                # 根组件
├── main.ts                # 应用入口
└── style.css              # 全局样式
```

## 🎯 简化优化说明

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
   - 删除空的 `src/styles/` 目录
   - 删除空的 `src/ui/` 目录
   - 删除空的 `src/core/` 目录

### 🚀 优化效果

- **减少嵌套层级**：从 4-5 层减少到 2-3 层
- **简化导入路径**：路径更短，更易维护
- **提高可读性**：结构更清晰，功能更明确
- **便于维护**：相关功能集中管理
- **符合约定**：遵循 Vue 3 项目最佳实践

### 📋 目录职责说明

- **`components/`**: 所有可复用的 UI 组件
- **`views/`**: 页面级组件，对应路由
- **`stores/`**: Pinia 状态管理
- **`composables/`**: Vue 3 组合式函数
- **`services/`**: 业务逻辑服务层
- **`ai/`**: AI 相关功能
- **`mindmap/`**: 思维导图核心逻辑
- **`workspace/`**: 工作区核心逻辑
- **`plugins/`**: 插件系统
- **`types/`**: TypeScript 类型定义
- **`utils/`**: 工具函数
- **`config/`**: 配置文件

## 🔧 使用建议

1. **新增组件**：放在 `src/components/` 对应子目录
2. **新增页面**：放在 `src/views/` 对应子目录
3. **新增状态**：放在 `src/stores/` 对应子目录
4. **新增工具函数**：放在 `src/utils/` 或 `src/composables/`
5. **新增服务**：放在 `src/services/` 对应子目录

这样的结构更加简洁、清晰，符合 Vue 3 + TypeScript 项目的最佳实践。
