# 代码格式化指南

## 概述

本项目使用 ESLint 和 Prettier 来确保代码质量和格式一致性。配置遵循现代前端最佳实践，支持 Vue 3、TypeScript 和 ES2022。

## 配置文件

### ESLint 配置

- `eslint.config.js` - ESLint 9.x 新格式配置文件
- 支持 Vue 3、TypeScript、JavaScript
- 集成 Prettier 规则
- 包含针对项目的自定义规则

### Prettier 配置

- `.prettierrc` - Prettier 格式化配置
- `.prettierignore` - 忽略格式化的文件

### 编辑器配置

- `.editorconfig` - 跨编辑器的基本格式配置
- `.vscode/settings.json` - VSCode/Cursor 专用设置
- `.vscode/extensions.json` - 推荐扩展列表

## 可用命令

### 代码检查和修复

```bash
# 检查代码质量问题
npm run lint

# 自动修复可修复的问题
npm run lint:fix

# 格式化所有代码
npm run format

# 检查代码格式（不修改文件）
npm run format:check

# TypeScript 类型检查
npm run type-check
```

### Git Hooks

项目配置了 pre-commit hook，会在提交前自动运行：

- ESLint 修复
- Prettier 格式化

如果检查失败，提交会被阻止。

## 代码规范

### JavaScript/TypeScript

- 使用单引号
- 语句末尾加分号
- 2 空格缩进
- 行长度限制 100 字符
- 尾随逗号：无
- 箭头函数参数：避免括号（单参数时）

### Vue 文件

- 组件名使用 PascalCase
- Props 定义使用 TypeScript 接口
- 优先使用 Composition API
- 使用 `<script setup>` 语法

### 命名规范

- 变量和函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 类型和接口：PascalCase
- 文件名：
  - 组件：PascalCase.vue
  - 工具文件：camelCase.ts
  - 配置文件：kebab-case.js

## 自动化特性

### 保存时自动格式化

如果使用 VSCode/Cursor，代码会在保存时自动：

- 运行 ESLint 修复
- 运行 Prettier 格式化
- 组织 import 语句

### 提交时自动检查

通过 lint-staged 和 husky：

- 只检查暂存的文件
- 自动修复可修复的问题
- 阻止不符合规范的代码提交

## 常见问题

### 1. ESLint 和 Prettier 冲突

项目已配置 `eslint-config-prettier` 来解决冲突。如果遇到格式问题：

```bash
npm run format
npm run lint:fix
```

### 2. Git hooks 不工作

确保 husky 已正确安装：

```bash
npx husky install
```

### 3. 类型检查错误

运行完整的类型检查：

```bash
npm run type-check
```

### 4. 跳过 Git hooks（紧急情况）

```bash
git commit --no-verify -m "紧急修复"
```

## 编辑器集成

### VSCode/Cursor

推荐安装的扩展（已在 `.vscode/extensions.json` 中配置）：

- Vue.volar - Vue 3 支持
- esbenp.prettier-vscode - Prettier 格式化
- dbaeumer.vscode-eslint - ESLint 检查
- EditorConfig.EditorConfig - EditorConfig 支持

### 其他编辑器

- 确保安装 ESLint 和 Prettier 插件
- 启用保存时自动格式化
- 配置 EditorConfig 支持

## 项目特定规则

### Vue 组件

- 允许单词组件名（`vue/multi-word-component-names: off`）
- Vue 3 允许多个根元素
- 强制 Vue 变量使用检查

### TypeScript

- 警告未使用变量（支持 `_` 前缀忽略）
- 警告使用 `any` 类型
- 在生产环境中禁用 console 和 debugger

### 忽略的文件

- `node_modules/`
- `dist/` 和 `build/`
- `.vite/`
- `coverage/`
- `tools/screenshots/`
- 所有 `.min.js` 文件

## 最佳实践

1. **提交前检查**：运行 `npm run lint` 确保没有错误
2. **格式一致性**：让工具处理格式，专注于逻辑
3. **渐进修复**：对于大型重构，可以分批修复 lint 问题
4. **团队协作**：所有团队成员使用相同的配置

## 更新配置

如需修改规则：

1. 更新 `eslint.config.js` 或 `.prettierrc`
2. 运行 `npm run format` 重新格式化
3. 确保团队成员同步更新
