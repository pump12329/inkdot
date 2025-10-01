# Pre-commit Hook 说明

这个pre-commit hook根据项目rules配置，确保代码质量和规范性。

## 🔍 检查流程

### Step 1: lint-staged 检查

- **代码格式化**: Prettier自动格式化JS/TS/Vue/JSON/MD文件
- **ESLint修复**: 自动修复可修复的代码规范问题
- **时间戳检查**: 确保Markdown文件包含正确的时间戳头部

### Step 2: TypeScript类型检查

- 运行 `npm run type-check`
- 确保所有TypeScript代码类型正确

### Step 3: 单元测试

- 运行 `npm run test:unit`
- 快速验证核心功能正确性

### Step 4: 构建验证

- 运行 `npm run build`
- 确保代码可以正常构建

## 📋 规则依据

根据以下项目规则文件配置：

- **frontend-development.mdc**: 提交前必须运行lint和type-check
- **testing-standards.mdc**: 提交前需要运行测试套件和覆盖率检查
- **code-quality-standards.mdc**: 提交前检查清单要求
- **development-workflow.mdc**: 开发流程中的提交规范

## ⚡ 性能优化

为了提高提交效率，这个hook只运行最关键的检查：

- **单元测试**: 而不是完整测试套件（集成测试和E2E测试在CI/CD中运行）
- **增量检查**: lint-staged只检查变更的文件
- **并行执行**: 某些检查可以并行运行

## 🚫 绕过Hook（不推荐）

如果确实需要绕过pre-commit检查：

```bash
git commit --no-verify -m "commit message"
```

**注意**: 绕过检查的代码可能会在CI/CD中失败。

## 🔧 自定义配置

### 修改检查项目

编辑 `.husky/pre-commit` 文件来调整检查步骤。

### 修改lint-staged配置

在 `package.json` 中的 `lint-staged` 部分修改文件检查规则。

### 修改时间戳检查

时间戳检查由 `docs/tools/timestamp-helper.js check-timestamp` 命令执行。

## 📝 故障排除

### 常见问题

1. **TypeScript错误**

   ```bash
   npm run type-check
   ```

2. **ESLint错误**

   ```bash
   npm run lint:fix
   ```

3. **测试失败**

   ```bash
   npm run test:unit --verbose
   ```

4. **构建失败**

   ```bash
   npm run build
   ```

5. **时间戳缺失**
   ```bash
   npm run docs:fix
   ```

### 完整本地测试

要运行完整的测试套件（包括CI/CD会运行的所有测试）：

```bash
npm run test:run           # 所有测试
npm run test:coverage      # 覆盖率报告
npm run test:e2e          # 端到端测试
npm run test:playwright   # Playwright测试
npm run test:puppeteer    # Puppeteer测试
```

## 📈 持续改进

这个pre-commit配置会根据项目需求和团队反馈持续优化：

- 平衡检查完整性和提交效率
- 根据项目发展调整检查项目
- 优化检查性能和用户体验

---

**配置版本**: v2.1.1
**最后更新**: T275.1
**维护**: 根据project rules自动配置
