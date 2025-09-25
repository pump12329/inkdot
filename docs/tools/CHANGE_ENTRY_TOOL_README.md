# InkDot 自动变更条目工具

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.4  
> **最后更新**：T0.4  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队

## 📋 工具概述

自动变更条目工具是一个智能化的Node.js脚本，能够自动检测项目变更并生成相应的CHANGELOG条目。该工具支持多种变更类型识别、智能描述生成和自动化条目添加功能。

## 🚀 快速开始

### 安装和配置

工具已集成到项目中，无需额外安装。确保项目根目录有`package.json`文件即可使用。

### 基本用法

```bash
# 查看帮助信息
npm run change:help

# 自动检测并添加变更条目
npm run change:auto

# 仅检测变更类型（不添加条目）
npm run change:detect

# 手动添加变更条目
npm run change:add -- --type feature --description "添加新功能"

# 扫描项目变更
npm run change:scan

# 交互式添加变更条目
npm run change:interactive
```

## 📖 详细功能

### 1. 自动检测 (auto)

自动检测项目变更并添加到CHANGELOG。

```bash
# 自动检测并添加所有变更
npm run change:auto
```

**功能特性：**

- 扫描Git工作区状态
- 智能识别变更类型
- 按类型分组变更
- 自动生成描述
- 添加到CHANGELOG对应位置

### 2. 变更检测 (detect)

仅检测变更类型，不添加条目到CHANGELOG。

```bash
# 检测变更类型
npm run change:detect
```

**输出示例：**

```
🤖 自动检测变更类型...
🔍 扫描项目变更...

📊 变更检测结果:

🆕 新增功能 (2项):
  - 添加用户认证功能 (src/auth/Login.vue)
  - 添加文件上传功能 (src/components/FileUpload.vue)

🐛 问题修复 (1项):
  - 修复登录页面bug (src/views/LoginPage.vue)

📝 文档更新 (1项):
  - 更新API文档 (docs/api/README.md)
```

### 3. 手动添加 (add)

手动指定变更类型和描述添加条目。

```bash
# 基本用法
npm run change:add -- --type <type> --description "<description>"

# 示例
npm run change:add -- --type feature --description "添加用户认证功能"
npm run change:add -- --type fix --description "修复登录页面bug"
npm run change:add -- --type documentation --description "更新API文档"
```

**支持的变更类型：**

- `feature` - 🆕 新增功能
- `fix` - 🐛 问题修复
- `improvement` - ⚡ 功能改进
- `documentation` - 📝 文档更新
- `style` - 🎨 样式调整
- `test` - ✅ 测试相关
- `build` - 🏗️ 构建配置
- `security` - 🔒 安全相关

### 4. 项目扫描 (scan)

扫描项目变更并显示详细信息。

```bash
npm run change:scan
```

**扫描内容：**

- Git工作区状态
- 文件变更类型
- 变更置信度
- 相关文件列表

### 5. 交互式添加 (interactive)

提供交互式界面添加变更条目。

```bash
npm run change:interactive
```

## 🔧 配置选项

### 变更类型配置

工具内置了8种变更类型，每种类型都有对应的关键词和图标：

```javascript
const changeTypes = {
  feature: {
    keywords: ['feat', 'feature', 'add', 'new', 'implement', 'create'],
    icon: '🆕',
    title: '新增功能',
    category: 'features'
  },
  fix: {
    keywords: ['fix', 'bug', 'error', 'issue', 'resolve', 'correct'],
    icon: '🐛',
    title: '问题修复',
    category: 'bugfixes'
  }
  // ... 其他类型
};
```

### 文件模式配置

工具根据文件路径和扩展名自动识别变更类型：

```javascript
const filePatterns = {
  feature: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.js'],
  documentation: ['docs/**/*.md', '*.md'],
  style: ['src/**/*.css', 'src/**/*.scss', 'src/**/*.vue'],
  test: ['tests/**/*.ts', 'tests/**/*.js', '**/*.test.*', '**/*.spec.*'],
  build: ['package.json', 'tsconfig.json', 'vite.config.*', '*.config.*']
};
```

## 📊 智能检测逻辑

### 变更类型识别

1. **文件路径分析**：根据文件所在目录判断类型
2. **文件扩展名**：根据文件扩展名判断类型
3. **关键词匹配**：分析变更内容中的关键词
4. **置信度计算**：基于多个因素计算识别置信度

### 描述生成规则

- **基础描述**：根据变更类型生成基础描述模板
- **关键词增强**：利用检测到的关键词优化描述
- **文件信息**：结合文件名生成更具体的描述
- **智能汇总**：多个文件时自动生成汇总描述

## 🔄 工作流程

### 推荐的开发流程

1. **开发功能**

   ```bash
   # 修改文件后
   git add .
   git commit -m "feat: 添加新功能"
   ```

2. **自动检测变更**

   ```bash
   npm run change:detect
   ```

3. **添加变更条目**

   ```bash
   npm run change:auto
   ```

4. **检查CHANGELOG**

   ```bash
   git diff docs/CHANGELOG.md
   ```

5. **提交CHANGELOG更新**
   ```bash
   git add docs/CHANGELOG.md
   git commit -m "docs: 更新CHANGELOG"
   ```

### 手动添加流程

1. **确定变更类型**

   ```bash
   npm run change:help
   ```

2. **手动添加条目**

   ```bash
   npm run change:add -- --type feature --description "添加用户认证功能"
   ```

3. **验证添加结果**
   ```bash
   git diff docs/CHANGELOG.md
   ```

## 🛠️ 高级用法

### 自定义变更类型

可以通过修改`CONFIG.changeTypes`来添加自定义变更类型：

```javascript
// 在 change-entry-helper.js 中添加
'performance': {
  keywords: ['perf', 'performance', 'optimize', 'speed', 'fast'],
  icon: '⚡',
  title: '性能优化',
  category: 'performance'
}
```

### 批量处理

```bash
# 处理多个变更
npm run change:add -- --type feature --description "批量功能更新" --files "src/auth/,src/components/"
```

### 集成到CI/CD

可以在GitHub Actions中集成自动变更检测：

```yaml
- name: Auto Update CHANGELOG
  run: |
    npm run change:auto
    git config --local user.email "action@github.com"
    git config --local user.name "GitHub Action"
    git add docs/CHANGELOG.md
    git commit -m "docs: 自动更新CHANGELOG" || exit 0
    git push
```

## 📝 输出格式

### CHANGELOG条目格式

工具生成的条目格式：

```markdown
#### 🆕 新增功能

- **添加用户认证功能** - T0.4
- **实现文件上传功能** - T0.4

#### 🐛 问题修复

- **修复登录页面bug** - T0.4
```

### 检测报告格式

```
📊 变更检测结果:

🆕 新增功能 (2项):
  - 添加Login.vue相关功能 (src/components/Login.vue)
  - 添加FileUpload.vue相关功能 (src/components/FileUpload.vue)

🐛 问题修复 (1项):
  - 修复LoginPage.vue相关问题 (src/views/LoginPage.vue)
```

## 🐛 故障排除

### 常见问题

1. **无法检测变更**
   - 确保在Git仓库中运行
   - 检查是否有未提交的变更
   - 验证文件路径是否正确

2. **变更类型识别错误**
   - 检查文件路径和扩展名
   - 使用手动添加指定正确类型
   - 查看关键词配置是否合适

3. **CHANGELOG更新失败**
   - 检查CHANGELOG文件格式
   - 确保有当前版本部分
   - 验证文件写入权限

### 调试模式

```bash
# 查看详细检测过程
DEBUG=1 npm run change:detect

# 检查Git状态
git status --porcelain

# 查看变更差异
git diff --cached
```

## 📚 相关工具

- **CHANGELOG工具**：`npm run changelog:help`
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
