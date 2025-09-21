# 贡献指南

> **文档版本**：v1.0.0  
> **最后更新**：T0.2  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  

感谢您对InkDot项目的关注！我们欢迎所有形式的贡献，包括但不限于代码、文档、设计、测试等。

## 🚀 快速开始

### 1. Fork 仓库
点击仓库右上角的 "Fork" 按钮，将项目复制到您的GitHub账户。

### 2. 克隆仓库
```bash
git clone https://github.com/your-username/inkdot.git
cd inkdot
```

### 3. 添加上游仓库
```bash
git remote add upstream https://github.com/original-username/inkdot.git
```

### 4. 安装依赖
```bash
npm install
```

### 5. 创建功能分支
```bash
git checkout -b feature/your-feature-name
```

## 📝 开发规范

### 代码风格
- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 和 Prettier 配置
- 使用 Vue 3 Composition API
- 编写清晰的注释和文档

### 提交信息规范
```
type(scope): description

feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建工具
```

示例：
```
feat(mindmap): 添加节点拖拽功能
fix(ai): 修复DeepSeek API调用错误
docs(readme): 更新安装说明
```

### 分支命名规范
- `feature/功能名称` - 新功能开发
- `fix/问题描述` - Bug修复
- `docs/文档类型` - 文档更新
- `refactor/重构内容` - 代码重构
- `test/测试内容` - 测试相关

## 🧪 测试

### 运行测试
```bash
# 运行所有测试
npm run test

# 运行特定测试
npm run test:unit
npm run test:e2e

# 测试覆盖率
npm run test:coverage
```

### 编写测试
- 单元测试：测试单个函数或组件
- 集成测试：测试模块间交互
- E2E测试：测试完整用户流程

## 📚 文档

### 更新文档
1. 修改相关文档文件
2. 更新时间戳：`npm run docs:update docs/README.md`
3. 提交更改

### 文档规范
- 使用Markdown格式
- 包含时间戳头部信息
- 保持文档结构清晰
- 添加必要的示例代码

## 🐛 报告问题

### 创建Issue
1. 检查是否已有类似问题
2. 使用清晰的标题描述问题
3. 提供详细的复现步骤
4. 包含环境信息（OS、Node版本等）
5. 添加相关截图或日志

### Issue模板
```markdown
## 问题描述
简要描述问题

## 复现步骤
1. 进入页面 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 预期行为
描述您期望发生的事情

## 实际行为
描述实际发生的事情

## 环境信息
- OS: [e.g. Windows 10]
- Node版本: [e.g. 18.0.0]
- 浏览器: [e.g. Chrome 91]

## 附加信息
添加任何其他相关信息
```

## 💡 功能建议

### 提出建议
1. 检查是否已有类似建议
2. 详细描述功能需求
3. 说明使用场景和价值
4. 提供可能的实现方案

### 建议模板
```markdown
## 功能描述
简要描述建议的功能

## 使用场景
描述在什么情况下会使用这个功能

## 预期效果
描述功能实现后的效果

## 实现建议
如果有的话，提供实现建议

## 附加信息
添加任何其他相关信息
```

## 🔄 提交流程

### 1. 同步上游
```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. 更新功能分支
```bash
git checkout your-feature-branch
git merge main
```

### 3. 提交更改
```bash
git add .
git commit -m "feat: 添加新功能"
```

### 4. 推送分支
```bash
git push origin your-feature-branch
```

### 5. 创建Pull Request
1. 在GitHub上创建PR
2. 填写PR描述
3. 关联相关Issue
4. 等待代码审查

## 📋 Pull Request 模板

```markdown
## 变更描述
简要描述本次变更

## 变更类型
- [ ] Bug修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 代码重构
- [ ] 性能优化
- [ ] 其他

## 测试
- [ ] 已添加测试
- [ ] 所有测试通过
- [ ] 手动测试通过

## 检查清单
- [ ] 代码遵循项目规范
- [ ] 已更新相关文档
- [ ] 已更新类型定义
- [ ] 无控制台错误
- [ ] 响应式设计正常

## 相关Issue
关联的Issue: #123

## 附加信息
添加任何其他相关信息
```

## 🏷️ 标签说明

### Issue标签
- `bug` - 错误报告
- `enhancement` - 功能建议
- `documentation` - 文档相关
- `question` - 问题咨询
- `help wanted` - 需要帮助
- `good first issue` - 适合新手

### PR标签
- `ready for review` - 准备审查
- `work in progress` - 进行中
- `needs testing` - 需要测试
- `breaking change` - 破坏性变更

## 🎯 开发优先级

### 高优先级
- 核心功能Bug修复
- 安全性问题
- 性能优化
- 用户体验改进

### 中优先级
- 新功能开发
- 文档完善
- 测试覆盖
- 代码重构

### 低优先级
- 代码风格调整
- 注释完善
- 示例代码
- 非核心功能

## 📞 获取帮助

### 社区支持
- GitHub Discussions
- Discord服务器
- 邮件列表

### 联系方式
- 项目维护者：@maintainer
- 技术问题：tech@inkdot.dev
- 一般咨询：contact@inkdot.dev

## 🙏 贡献者

感谢所有为InkDot项目做出贡献的开发者！

<!-- 这里会自动生成贡献者列表 -->

---

**感谢您的贡献！** 🎉

---

**文档版本**：v1.0.0  
**最后更新**：T0.2  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.2
