# InkDot 快速入门指南

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.4  
> **最后更新**：T0.4  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.4

## 🚀 5分钟快速开始

本指南将帮助你在5分钟内快速设置InkDot开发环境并开始开发。

### 前提条件

确保你的系统已安装：
- **Node.js** >= 18.0.0
- **npm** >= 8.0.0
- **Git** >= 2.30.0

### 步骤1：克隆项目

```bash
git clone https://github.com/pump12329/inkdot.git
cd inkdot
```

### 步骤2：自动设置开发环境

```bash
# 运行自动设置脚本
node scripts/setup-dev-environment.js
```

这个脚本会自动：
- ✅ 检查系统环境要求
- ✅ 安装项目依赖
- ✅ 配置Git hooks
- ✅ 设置环境变量
- ✅ 验证开发环境

### 步骤3：配置API密钥

编辑 `.env.local` 文件，配置你的API密钥：

```bash
# 编辑环境变量文件
nano .env.local  # 或使用你喜欢的编辑器
```

```env
# 配置你的API密钥
VITE_DEEPSEEK_API_KEY=your_deepseek_api_key_here
VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 步骤4：启动开发服务器

```bash
# 启动前端开发服务器
npm run dev
```

访问 http://localhost:5173 查看应用。

### 步骤5：开始开发

```bash
# 创建功能分支
git checkout -b feature/your-feature-name

# 开始编码...
# 添加测试...
# 提交代码...

# 创建Pull Request
git push origin feature/your-feature-name
```

## 🛠️ 常用命令

### 开发命令
```bash
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览构建结果
npm run type-check       # TypeScript类型检查
```

### 代码质量
```bash
npm run lint             # 检查代码风格
npm run lint:fix         # 自动修复代码风格
npm run test             # 运行测试
npm run test:coverage    # 生成测试覆盖率报告
```

### 项目工具
```bash
npm run changelog:update # 更新CHANGELOG
npm run status:update    # 更新文档状态
npm run docs:update      # 更新文档时间戳
```

## 📁 项目结构速览

```
inkdot/
├── docs/                    # 📚 项目文档
│   ├── development/         # 开发相关文档
│   ├── architecture/        # 架构设计文档
│   └── tools/              # 开发工具文档
├── scripts/                 # 🔧 自动化脚本
├── src/                     # 💻 源代码
│   ├── components/          # Vue组件
│   ├── views/              # 页面视图
│   ├── stores/             # Pinia状态管理
│   ├── services/           # API服务
│   └── utils/              # 工具函数
├── tests/                   # 🧪 测试文件
├── package.json            # 项目配置
└── vite.config.ts          # 构建配置
```

## 🎯 开发重点

### 核心技术栈
- **Vue 3** + **TypeScript** + **Pinia**
- **Vite** + **Tailwind CSS** + **Element Plus**
- **AI集成**：DeepSeek API + OpenRouter API

### 开发规范
- 使用 **Composition API** 和 `<script setup>`
- 严格的 **TypeScript** 类型检查
- **ESLint** + **Prettier** 代码格式化
- **Conventional Commits** 提交规范

### 测试策略
- **单元测试**：Vitest
- **组件测试**：Vue Test Utils
- **E2E测试**：Playwright

## 📚 下一步学习

1. **阅读详细文档**：
   - [初期开发指南](./initial-development-guide.md)
   - [项目规则](../development/project-rules.md)
   - [系统架构](../architecture/system-architecture.md)

2. **了解开发工具**：
   - [CHANGELOG工具](../tools/CHANGELOG_TOOL_README.md)
   - [变更条目工具](../tools/CHANGE_ENTRY_TOOL_README.md)
   - [文档状态工具](../tools/STATUS_UPDATE_TOOL_README.md)

3. **参与开发**：
   - 查看 [贡献指南](../../CONTRIBUTING.md)
   - 提交 [Issues](https://github.com/pump12329/inkdot/issues)
   - 参与 [讨论](https://github.com/pump12329/inkdot/discussions)

## 🆘 需要帮助？

- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **技术支持**：linhuinan542@gmail.com
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)

---

**快速入门版本**：v1.0.0  
**最后更新**：T0.4  
**维护者**：InkDot开发团队
