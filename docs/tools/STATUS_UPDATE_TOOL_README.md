# InkDot 文档状态总览自动更新工具

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.4  
> **最后更新**：T0.4  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  

## 📋 工具概述

文档状态总览自动更新工具是一个智能化的Node.js脚本，能够自动扫描项目中的所有Markdown文档，解析文档头部信息，并自动更新CHANGELOG中的文档状态总览表格。该工具支持多种文档状态分类和一致性检查功能。

## 🚀 快速开始

### 安装和配置

工具已集成到项目中，无需额外安装。确保项目根目录有`package.json`文件即可使用。

### 基本用法

```bash
# 查看帮助信息
npm run status:help

# 更新CHANGELOG中的文档状态总览
npm run status:update

# 扫描项目文档状态
npm run status:scan

# 检查文档状态一致性
npm run status:check
```

## 📖 详细功能

### 1. 状态总览更新 (update)

自动扫描所有文档并更新CHANGELOG中的文档状态总览表格。

```bash
# 更新文档状态总览
npm run status:update
```

**功能特性：**
- 递归扫描项目中的所有Markdown文件
- 解析文档头部信息（版本、时间戳、状态）
- 按状态分类显示文档
- 自动生成格式化的状态表格
- 替换CHANGELOG中的现有状态总览

**输出示例：**
```
📊 更新CHANGELOG文档状态总览...
🔍 扫描项目文档状态...
✅ 文档状态总览已更新

📈 更新统计:
  🟢 当前文档: 27 个
  🚧 开发中文档: 0 个
  🟡 过时文档: 0 个
  🔴 废弃文档: 0 个
  ❌ 无效文档: 0 个
```

### 2. 文档状态扫描 (scan)

扫描项目文档状态但不更新CHANGELOG。

```bash
# 扫描文档状态
npm run status:scan
```

**扫描内容：**
- 所有Markdown文件的头部信息
- 文档版本号和状态
- 最后更新时间戳
- 维护者和审查信息

### 3. 状态一致性检查 (check)

检查文档状态的一致性和完整性。

```bash
# 检查文档状态一致性
npm run status:check
```

**检查项目：**
- 文档头部信息的完整性
- 状态字段的有效性
- 版本号格式的正确性
- 时间戳格式的规范性

**输出示例：**
```
📊 文档状态统计:
  总计文档: 27 个
  🟢 当前文档: 27 个
  🚧 开发中文档: 0 个
  🟡 过时文档: 0 个
  🔴 废弃文档: 0 个
  ❌ 无效文档: 0 个
```

## 🔧 配置选项

### 文档状态类型

工具支持4种文档状态类型：

```javascript
const documentCategories = {
  'current': {
    title: '🟢 当前文档 (CURRENT)',
    status: 'CURRENT',
    icon: '🟢'
  },
  'draft': {
    title: '🚧 开发中文档 (DRAFT)',
    status: 'DRAFT',
    icon: '🚧'
  },
  'outdated': {
    title: '🟡 计划更新文档 (OUTDATED)',
    status: 'OUTDATED',
    icon: '🟡'
  },
  'deprecated': {
    title: '🔴 已废弃文档 (DEPRECATED)',
    status: 'DEPRECATED',
    icon: '🔴'
  }
};
```

### 排除模式配置

工具会自动排除以下目录和文件：

```javascript
const excludePatterns = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**'
];
```

### 文档头部格式要求

工具期望的文档头部格式：

```markdown
> **文档版本**：v1.0.0  
> **创建时间戳**：T0.3 (可选)
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3 (可选)
```

## 📊 智能解析功能

### 文档头部解析

工具能够智能解析以下字段：

1. **文档版本**：`v1.0.0` 格式
2. **创建时间戳**：`T0.3` 格式（可选）
3. **最后更新**：`T0.3` 格式
4. **状态**：支持emoji前缀的状态标识
5. **维护者**：文档维护者信息
6. **下次审查**：审查时间戳（可选）

### 状态标识处理

工具能够自动处理状态字段中的emoji：

- `🟢 CURRENT` → `CURRENT`
- `🚧 DRAFT` → `DRAFT`
- `🟡 OUTDATED` → `OUTDATED`
- `🔴 DEPRECATED` → `DEPRECATED`

### 表格生成规则

**当前文档表格：**
```markdown
### 🟢 当前文档 (CURRENT)
| 文档名称 | 版本 | 最后更新 | 状态 |
|---------|------|----------|------|
| system-architecture.md | v1.2.0 | T0.3 | 🟢 CURRENT |
```

**开发中文档表格：**
```markdown
### 🚧 开发中文档 (DRAFT)
| 文档名称 | 版本 | 预计完成 | 状态 |
|---------|------|----------|------|
| api-reference.md | v1.0.0 | T5.0 | 🚧 DRAFT |
```

## 🔄 工作流程

### 推荐的文档维护流程

1. **开发新文档**
   ```bash
   # 创建新文档时添加标准头部
   echo "> **文档版本**：v1.0.0  
   > **最后更新**：T0.4  
   > **状态**：🟢 CURRENT  
   > **维护者**：InkDot开发团队" > new-doc.md
   ```

2. **更新文档后检查状态**
   ```bash
   npm run status:check
   ```

3. **更新CHANGELOG状态总览**
   ```bash
   npm run status:update
   ```

4. **提交更改**
   ```bash
   git add docs/CHANGELOG.md
   git commit -m "docs: 更新文档状态总览"
   ```

### 定期维护流程

1. **月度文档审查**
   ```bash
   # 检查所有文档状态
   npm run status:check
   
   # 更新状态总览
   npm run status:update
   ```

2. **版本发布前检查**
   ```bash
   # 确保所有文档状态正确
   npm run status:check
   
   # 更新CHANGELOG
   npm run status:update
   npm run changelog:update
   ```

## 🛠️ 高级用法

### 自定义排除模式

可以通过修改`CONFIG.excludePatterns`来添加自定义排除模式：

```javascript
const CONFIG = {
  excludePatterns: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    'build/**',
    'temp/**',        // 添加临时目录
    '**/draft/**'     // 排除所有草稿目录
  ]
};
```

### 批量文档状态更新

```bash
# 先检查状态
npm run status:check

# 更新状态总览
npm run status:update

# 同时更新CHANGELOG
npm run changelog:update
```

### 集成到CI/CD

可以在GitHub Actions中集成自动状态检查：

```yaml
- name: Check Document Status
  run: |
    npm run status:check
    npm run status:update
    
- name: Update CHANGELOG
  run: |
    npm run changelog:update
    
- name: Commit Updates
  run: |
    git config --local user.email "action@github.com"
    git config --local user.name "GitHub Action"
    git add docs/CHANGELOG.md
    git commit -m "docs: 自动更新文档状态和CHANGELOG" || exit 0
    git push
```

## 📝 输出格式

### 状态统计报告

```
📊 文档状态统计:
  总计文档: 27 个
  🟢 当前文档: 27 个
  🚧 开发中文档: 0 个
  🟡 过时文档: 0 个
  🔴 废弃文档: 0 个
  ❌ 无效文档: 0 个
```

### 更新统计报告

```
📈 更新统计:
  🟢 当前文档: 27 个
  🚧 开发中文档: 0 个
  🟡 过时文档: 0 个
  🔴 废弃文档: 0 个
  ❌ 无效文档: 0 个
```

### CHANGELOG表格格式

```markdown
## 📊 文档状态总览

### 🟢 当前文档 (CURRENT)
| 文档名称 | 版本 | 最后更新 | 状态 |
|---------|------|----------|------|
| system-architecture.md | v1.2.0 | T0.3 | 🟢 CURRENT |
| project-rules.md | v1.3.0 | T0.3 | 🟢 CURRENT |

### 🚧 开发中文档 (DRAFT)
*当前无开发中文档*

### 🟡 计划更新文档 (OUTDATED)
*当前无过时文档*

### 🔴 已废弃文档 (DEPRECATED)
*当前无废弃文档*
```

## 🐛 故障排除

### 常见问题

1. **无法找到文档状态总览部分**
   - 检查CHANGELOG.md文件是否存在
   - 确保包含"## 📊 文档状态总览"标题
   - 验证文件编码为UTF-8

2. **文档头部解析失败**
   - 检查文档头部格式是否符合要求
   - 确保包含必要的字段（版本、最后更新、状态）
   - 验证状态字段格式是否正确

3. **状态更新失败**
   - 检查文件写入权限
   - 确保CHANGELOG文件未被锁定
   - 验证磁盘空间是否充足

### 调试模式

```bash
# 查看详细扫描过程
DEBUG=1 npm run status:scan

# 检查特定文档
head -10 docs/architecture/system-architecture.md

# 验证CHANGELOG格式
grep -n "文档状态总览" docs/CHANGELOG.md
```

## 📚 相关工具

- **CHANGELOG工具**：`npm run changelog:help`
- **变更条目工具**：`npm run change:help`
- **时间戳工具**：`npm run timestamp:help`
- **文档扫描**：`npm run docs:scan`

## 📞 技术支持

如有问题或建议，请联系：
- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **技术支持**：linhuinan542@gmail.com
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)

---

**工具版本**：v1.0.0  
**最后更新**：T0.4  
**维护者**：InkDot开发团队
