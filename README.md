# InkDot - 创意创作思维导图平台

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

> **项目版本**：v1.0.0  
> **最后更新**：T0.2  
> **状态**：🚧 开发中  
> **维护者**：InkDot开发团队

## 🎯 项目简介

InkDot是一个基于思维导图的AI驱动创意创作平台，支持小说创作、跑团、文字冒险等多种创作模式。通过AI Agent作为创作伙伴，提供智能化的内容生成和分析功能。

## ✨ 核心特性

### 🧠 思维导图核心

- **直观的节点编辑** - 直接在节点上编辑内容
- **智能连接管理** - 自动识别节点关系
- **多模式支持** - 小说、跑团、文字冒险等创作模式
- **实时协作** - 支持多人同时编辑

### 🤖 AI创作助手

- **DeepSeek集成** - 强大的中文AI模型
- **OpenRouter支持** - 多模型选择
- **智能建议** - 基于上下文的创作建议
- **内容生成** - 自动生成角色、情节、对话等

### 🎨 现代化界面

- **Vue 3 + TypeScript** - 现代化的前端技术栈
- **响应式设计** - 适配各种设备
- **主题支持** - 明暗主题切换
- **可定制布局** - 个性化工作区

### 🔌 插件系统

- **热插拔支持** - 动态加载插件
- **统一API** - 标准化的插件接口
- **MCP集成** - Model Context Protocol支持
- **社区生态** - 丰富的第三方插件

## 🚀 快速开始

### 环境要求

- Node.js 18.0+
- npm 8.0+ 或 yarn 1.22+

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 📁 项目结构

```
inkdot/
├── src/                    # 源代码
│   ├── ui/                # 前端界面
│   │   ├── components/    # Vue组件
│   │   ├── composables/   # 组合式函数
│   │   └── stores/        # 状态管理
│   ├── core/              # 核心逻辑
│   │   ├── mindmap/       # 思维导图引擎
│   │   ├── workspace/     # 工作区管理
│   │   ├── agent/         # Agent运行时
│   │   └── plugin-manager/ # 插件管理器
│   ├── ai/                # AI集成
│   │   ├── agents/        # AI Agents
│   │   ├── langchain/     # LangChain集成
│   │   └── mcp/           # MCP服务
│   ├── services/          # 服务层
│   │   ├── api/           # API服务
│   │   ├── database/      # 数据库
│   │   └── storage/       # 存储服务
│   ├── plugins/           # 插件系统
│   │   ├── sdk/           # 插件SDK
│   │   └── registry/      # 插件注册表
│   ├── types/             # 类型定义
│   └── utils/             # 工具函数
├── docs/                  # 项目文档
├── examples/              # 示例文件
├── demos/                 # 演示项目
└── tests/                 # 测试文件
```

## 🛠️ 技术栈

### 前端

- **Vue 3** - 渐进式JavaScript框架
- **TypeScript** - 类型安全的JavaScript
- **Pinia** - 状态管理
- **Vite** - 构建工具

### 后端

- **Node.js** - JavaScript运行时
- **Express** - Web框架
- **SQLite** - 轻量级数据库

### AI集成

- **DeepSeek API** - 中文AI模型
- **OpenRouter API** - 多模型访问
- **LangChain** - AI应用框架

### 开发工具

- **ESLint** - 代码检查
- **Vitest** - 单元测试

## 📚 文档

- [快速开始指南](docs/development/quick-start.md)
- [个人开发指南](docs/development/personal-dev-guide.md)
- [系统架构设计](docs/architecture/system-architecture.md)
- [API文档](docs/api/api-reference.md)
- [用户手册](docs/user-guide/user-manual.md)

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 开发流程

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和社区成员！

## 📞 联系我们

- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)
- **技术支持**：linhuinan542@gmail.com
- **项目维护者**：pump12329
- **项目主页**：[https://github.com/pump12329/inkdot](https://github.com/pump12329/inkdot)

---

**InkDot** - 让创意在思维导图中绽放 ✨
test change
