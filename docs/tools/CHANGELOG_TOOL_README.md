# InkDot CHANGELOG 自动更新工具

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.4  
> **最后更新**：T0.4  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队

## 📋 工具概述

CHANGELOG自动更新工具是一个强大的Node.js脚本，能够自动解析Git提交记录并生成结构化的CHANGELOG条目。该工具支持版本号管理、提交分类、时间戳更新等功能。

## 🚀 快速开始

### 安装和配置

工具已集成到项目中，无需额外安装。确保项目根目录有`package.json`文件即可使用。

### 基本用法

```bash
# 查看帮助信息
npm run changelog:help

# 查看当前状态
npm run changelog:status

# 自动更新CHANGELOG
npm run changelog:update

# 手动添加条目
npm run changelog:add -- feat "添加新功能"

# 版本管理
npm run changelog:version -- minor
```

## 📖 详细功能

### 1. 自动更新 (update)

自动解析Git提交记录并生成CHANGELOG条目。

```bash
# 更新所有提交
npm run changelog:update

# 只处理指定日期之后的提交
npm run changelog:update -- --since "2024-01-01"
```

**功能特性：**

- 自动解析提交类型和描述
- 智能版本号递增 (major/minor/patch)
- 按类别分组提交记录
- 自动更新时间戳
- 过滤无关提交 (docs:, chore:, style:, refactor:)

### 2. 手动添加条目 (add)

手动添加CHANGELOG条目到当前版本。

```bash
# 基本用法
npm run changelog:add -- <type> <description> [version]

# 示例
npm run changelog:add -- feat "添加用户认证功能"
npm run changelog:add -- fix "修复登录页面bug" "1.4.0"
```

**支持的提交类型：**

- `feat` - 🆕 新增功能
- `fix` - 🐛 修复问题
- `docs` - 📝 文档更新
- `style` - 🎨 样式调整
- `refactor` - ♻️ 代码重构
- `perf` - ⚡ 性能优化
- `test` - ✅ 测试相关
- `build` - 🏗️ 构建相关
- `ci` - 👷 CI/CD
- `chore` - 🔧 维护任务

### 3. 状态查看 (status)

查看CHANGELOG和Git仓库的当前状态。

```bash
npm run changelog:status
```

**显示信息：**

- 当前版本号
- 当前时间戳
- CHANGELOG文件路径
- 最近5条提交记录

### 4. 版本管理 (version)

管理版本号类型。

```bash
npm run changelog:version -- major    # 主版本
npm run changelog:version -- minor    # 次版本
npm run changelog:version -- patch    # 修订版本
```

## 🔧 配置选项

### 配置文件

工具使用内置配置，主要参数：

```javascript
const CONFIG = {
  changelogPath: 'docs/CHANGELOG.md', // CHANGELOG文件路径
  projectStartDate: '2025-09-21', // 项目开始日期
  maxCommits: 50, // 最大处理提交数
  excludePatterns: [
    // 排除的提交模式
    /^docs?:/i,
    /^chore:/i,
    /^style:/i,
    /^refactor:/i
  ]
};
```

### 版本号规则

- **Major (主版本)**：包含破坏性变更或重大功能更新
- **Minor (次版本)**：包含新功能但不破坏现有功能
- **Patch (修订版本)**：包含错误修复和小幅改进

## 📊 输出格式

### CHANGELOG条目格式

```markdown
### [v1.4.0] - T0.4

#### 🆕 新增

- **添加用户认证功能** - [abc1234]
- **实现文件上传功能** - [def5678]

#### 🐛 修复

- **修复登录页面bug** - [ghi9012]

#### 📝 文档

- **更新API文档** - [jkl3456]

---
```

### 提交记录格式

工具期望的标准提交格式：

```
<type>: <description>

[可选的详细描述]

[可选的脚注]
```

**示例：**

```
feat: 添加用户认证功能

实现JWT token认证系统
支持登录、注册、登出功能

BREAKING CHANGE: 认证API接口已更改
```

## 🔄 工作流程

### 推荐的开发流程

1. **开发功能**

   ```bash
   git add .
   git commit -m "feat: 添加新功能"
   ```

2. **自动更新CHANGELOG**

   ```bash
   npm run changelog:update
   ```

3. **检查更新结果**

   ```bash
   npm run changelog:status
   ```

4. **提交CHANGELOG更新**
   ```bash
   git add docs/CHANGELOG.md
   git commit -m "docs: 更新CHANGELOG"
   ```

### 版本发布流程

1. **准备发布**

   ```bash
   npm run changelog:update
   ```

2. **检查版本号**

   ```bash
   npm run changelog:status
   ```

3. **创建版本标签**
   ```bash
   git tag v1.4.0
   git push origin v1.4.0
   ```

## 🛠️ 高级用法

### 自定义提交类型

可以通过修改`COMMIT_TYPE_MAP`来添加自定义提交类型：

```javascript
const COMMIT_TYPE_MAP = {
  // 现有类型...
  security: { icon: '🔒', title: '安全', category: 'security' },
  i18n: { icon: '🌐', title: '国际化', category: 'i18n' }
};
```

### 批量处理

```bash
# 处理最近10条提交
npm run changelog:update -- --since "1 week ago"

# 处理特定分支的提交
git log --oneline feature-branch | head -5
npm run changelog:add -- feat "批量添加功能"
```

### 集成到CI/CD

可以在GitHub Actions或其他CI系统中集成：

```yaml
- name: Update CHANGELOG
  run: |
    npm run changelog:update
    git config --local user.email "action@github.com"
    git config --local user.name "GitHub Action"
    git add docs/CHANGELOG.md
    git commit -m "docs: 自动更新CHANGELOG" || exit 0
    git push
```

## 🐛 故障排除

### 常见问题

1. **无法读取Git提交记录**
   - 确保在Git仓库中运行
   - 检查Git配置是否正确

2. **CHANGELOG格式错误**
   - 检查文件路径是否正确
   - 确保CHANGELOG文件格式符合预期

3. **版本号解析失败**
   - 检查CHANGELOG中的版本格式
   - 确保版本号遵循语义化版本规范

### 调试模式

```bash
# 查看详细输出
DEBUG=1 npm run changelog:update

# 检查Git状态
git status
git log --oneline -5
```

## 📚 相关文档

- [项目规则文档](../development/project-rules.md)
- [时间戳工具文档](./timestamp-helper.js)
- [CHANGELOG文件](../CHANGELOG.md)

## 📞 技术支持

如有问题或建议，请联系：

- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **技术支持**：linhuinan542@gmail.com
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)

---

**工具版本**：v1.0.0  
**最后更新**：T0.4  
**维护者**：InkDot开发团队
