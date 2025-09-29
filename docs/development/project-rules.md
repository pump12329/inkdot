# InkDot 核心开发规则

## 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + Vite
- **后端**: Node.js + Express + Fastify
- **AI集成**: DeepSeek API + OpenRouter API
- **存储**: SQLite + JSON文件 + 本地存储

## 核心原则

1. **简洁性优先** - 代码简洁明了，避免过度工程化
2. **功能单一** - 每个函数和组件只做一件事
3. **渐进式开发** - 先实现核心功能，再添加高级特性
4. **用户体验优先** - 界面简洁直观，操作流程简化

## 代码规范

### TypeScript 规范

- 使用严格模式 `"strict": true`
- 明确的类型定义，避免 `any`
- 优先使用 `type` 而不是 `interface`

### Vue 3 规范

- 使用 Composition API 和 `<script setup>`
- 组件名使用 PascalCase
- Props 使用 `defineProps`，Emits 使用 `defineEmits`

### 文件命名

- 组件: `MindMapNode.vue`
- 工具函数: `nodeUtils.ts`
- 类型定义: `mindMapTypes.ts`

## 目录结构

```
src/
├── components/     # 通用组件
├── views/         # 页面组件
├── stores/        # Pinia状态管理
├── types/         # TypeScript类型定义
├── utils/         # 工具函数
├── services/      # API服务
└── hooks/         # 组合式函数
```

## 设计原则

- **单页面应用** - 流畅的用户体验
- **极简界面** - 黑白灰配色，充足留白
- **3次点击原则** - 任何功能最多3次点击到达
- **智能默认** - 合理的默认设置

## 测试要求

- 单元测试覆盖率 ≥ 70%
- 核心功能必须有测试
- 使用 Vitest + Vue Test Utils

## Git 规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建工具

示例: feat(mindmap): 添加节点拖拽功能
```

## 核心命令

```bash
npm run dev        # 开发服务器
npm run build      # 生产构建
npm run test       # 运行测试
npm run lint       # 代码检查
```

记住：**简单就是美，简洁就是力量**
