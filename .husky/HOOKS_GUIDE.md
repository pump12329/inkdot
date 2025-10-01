# Git Hooks 配置指南

## 🎯 概述

本项目使用 Husky 配置了完整的 Git hooks 工作流，确保代码质量和提交规范。

## 📋 Hooks 列表

### 1. pre-commit

**执行时机**: 执行 `git commit` 命令后，在编辑器打开提交信息之前

**检查内容**:

- ✅ 代码格式化 (lint-staged)
- ✅ TypeScript 类型检查
- ✅ 构建验证
- ✅ 单元测试

**优化特性**:

- 🚀 智能跳过：只检查变更的文件类型
- ⏱️ 性能监控：显示每项检查的耗时
- 📦 增量构建：小文件变更时使用缓存

### 2. commit-msg

**执行时机**: 提交信息编辑完成后，实际提交之前

**检查内容**:

- ✅ 提交信息格式规范
- ✅ 长度限制 (72字符)
- ✅ 类型验证 (feat, fix, docs 等)
- ✅ 描述完整性

**支持的类型**:

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式 (不影响功能)
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建工具、依赖更新
- `perf`: 性能优化
- `ci`: CI/CD 相关
- `build`: 构建系统
- `revert`: 回滚提交
- `WIP`: 工作进行中

### 3. prepare-commit-msg

**执行时机**: 提交信息编辑器打开之后，输入信息之前

**功能**:

- 💡 智能建议：根据文件变更建议提交类型
- 📝 模板生成：为特定类型提供提交信息模板

### 4. pre-push

**执行时机**: 执行 `git push` 命令后，实际推送之前

**检查内容**:

- ✅ 完整测试套件 (主分支推送)
- ✅ 测试覆盖率检查
- ✅ 分支名称规范建议
- ✅ 推送统计信息

**分支差异化处理**:

- **主分支 (main/master)**: 运行完整测试套件和覆盖率检查
- **其他分支**: 只运行快速测试，完整测试在CI中执行

## 🚀 性能优化

### 1. 智能跳过机制

```bash
# 只有代码文件变更时才运行类型检查和构建
if [ $STAGED_CODE_FILES -gt 0 ]; then
  # 运行相关检查
else
  echo "⏭️ Skipping checks (no code files changed)"
fi
```

### 2. 并行执行

- lint-staged 支持并行处理多个文件
- TypeScript 检查使用增量编译

### 3. 缓存策略

- 小文件变更时使用增量构建
- 保留构建缓存减少重复工作

### 4. 性能监控

每个步骤都显示执行时间，帮助识别性能瓶颈：

```
✅ Lint-staged passed (234ms)
✅ TypeScript check passed (567ms)
✅ Build check passed (1234ms)
✅ Unit tests passed (89ms)
🎉 All checks passed! Total time: 2124ms
```

## 🛠️ 配置文件说明

### package.json - lint-staged 配置

```json
{
  "lint-staged": {
    "*.{js,ts,vue}": ["eslint --fix --quiet", "prettier --write --log-level warn"],
    "*.md": [
      "node docs/tools/timestamp-helper.js check-timestamp",
      "prettier --write --log-level warn"
    ]
  }
}
```

### .husky/ 目录结构

```
.husky/
├── _/              # Husky 内部文件
├── pre-commit      # 提交前检查
├── commit-msg      # 提交信息验证
├── prepare-commit-msg  # 提交信息准备
├── pre-push        # 推送前检查
├── README.md       # Hooks 说明文档
└── HOOKS_GUIDE.md  # 详细配置指南
```

## 📝 最佳实践

### 1. 提交信息规范

```bash
# 好的例子
feat(mindmap): add node drag and drop functionality
fix(canvas): resolve zoom issue on mobile devices
docs(api): update authentication endpoint documentation
test(components): add unit tests for MindMapNode component

# 不好的例子
fixed bug
update files
wip
```

### 2. 分支命名规范

```bash
# 推荐格式
feat/add-node-dragging
fix/mobile-zoom-issue
docs/update-api-docs
test/improve-coverage
```

### 3. 常用命令

```bash
# 绕过 hooks (不推荐)
git commit --no-verify -m "message"
git push --no-verify

# 手动运行检查
npm run lint:fix
npm run type-check
npm run test:unit
npm run build

# 运行完整测试套件
npm run test:run
npm run test:coverage
```

## 🔧 故障排除

### 常见问题

1. **Pre-commit hook 执行失败**

   ```bash
   # 查看详细错误信息
   git commit -v

   # 手动运行检查
   npm run lint:fix
   npm run type-check
   ```

2. **Commit message 格式错误**

   ```bash
   # 修改最后一次提交信息
   git commit --amend

   # 使用正确格式
   git commit -m "feat(scope): description"
   ```

3. **Push hook 执行时间过长**
   - 检查是否推送了大量提交
   - 考虑合并相关提交
   - 对于非主分支，只运行快速检查

### 调试模式

为 hooks 添加调试输出：

```bash
# 在 hook 文件中添加
set -x  # 开启调试模式
echo "DEBUG: Running hook..."
```

## 📈 性能统计

### 典型执行时间 (基于项目当前状态)

- **lint-staged**: 200-500ms
- **TypeScript 检查**: 500-1000ms
- **构建验证**: 1000-2000ms
- **单元测试**: 100-300ms

**总计**: 2-4秒 (取决于变更范围)

### 优化建议

1. 保持项目规模适中
2. 合理使用 git ignore
3. 定期清理不必要的文件
4. 优化 TypeScript 配置

## 🔄 版本历史

- **v2.1.0**: 添加性能监控和智能跳过
- **v2.0.0**: 完整 hooks 工作流
- **v1.0.0**: 基础 pre-commit hook

---

**配置版本**: v2.1.0
**最后更新**: $(date +"T%Y.%m.%d")
**维护者**: 项目团队
