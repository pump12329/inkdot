# InkDot 项目文档

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📚 文档目录结构

本项目采用分级目录结构组织文档，确保信息清晰有序，便于查找和维护。

### 📁 目录说明

```
docs/
├── README.md                    # 文档导航（本文件）
├── architecture/                # 架构设计文档
│   ├── system-architecture.md  # 系统架构设计
│   ├── data-models.md          # 数据模型设计
│   ├── ai-integration.md       # AI集成架构
│   └── plugin-system.md        # 插件系统架构
├── development/                 # 开发相关文档
│   ├── development-plan.md     # 开发计划
│   ├── coding-standards.md     # 编码规范
│   ├── project-rules.md        # 项目规则
│   └── testing-guide.md        # 测试指南
├── design/                     # 设计文档
│   ├── ui-design.md           # UI设计规范
│   ├── logo-specification.md  # Logo设计规范
│   ├── workspace-design.md    # 工作区设计
│   └── interaction-design.md  # 交互设计
├── api/                       # API文档
│   ├── api-reference.md       # API参考文档
│   ├── ai-services.md         # AI服务接口
│   └── plugin-api.md          # 插件API
├── user-guide/                # 用户指南
│   ├── getting-started.md     # 快速开始
│   ├── user-manual.md         # 用户手册
│   ├── features.md            # 功能介绍
│   └── faq.md                 # 常见问题
└── deployment/                # 部署文档
    ├── installation.md        # 安装指南
    ├── configuration.md       # 配置说明
    └── troubleshooting.md     # 故障排除
```

## 🎯 文档导航

### 🏗️ 架构设计

- [系统架构设计](./architecture/system-architecture.md) - 整体系统架构和技术栈
- [数据模型设计](./architecture/data-models.md) - 数据库设计和数据结构
- [AI集成架构](./architecture/ai-integration.md) - AI服务集成方案
- [插件系统架构](./architecture/plugin-system.md) - 插件系统设计

### 🛠️ 开发指南

- [快速开始](./development/quick-start.md) - 5分钟快速上手指南
- [个人开发指南](./development/personal-dev-guide.md) - 专为个人开发者设计
- [开发计划](./development/development-plan.md) - 项目开发时间线和里程碑
- [编码规范](./development/coding-standards.md) - 代码风格和最佳实践
- [代码模板](./development/coding-templates.md) - 常用代码模板和示例
- [项目规则](./development/project-rules.md) - Cursor AI辅助开发规则
- [测试指南](./development/testing-guide.md) - 测试策略和规范

### 🎨 设计规范

- [UI设计规范](./design/ui-design.md) - 界面设计标准和组件库
- [Logo设计规范](./design/logo-specification.md) - 品牌标识使用指南
- [工作区设计](./design/workspace-design.md) - Workspace界面设计
- [交互设计](./design/interaction-design.md) - 用户交互规范

### 📡 API文档

- [API参考文档](./api/api-reference.md) - 完整的API接口说明
- [AI服务接口](./api/ai-services.md) - DeepSeek和OpenRouter集成
- [插件API](./api/plugin-api.md) - 插件开发接口

### 📖 用户指南

- [快速开始](./user-guide/getting-started.md) - 新用户入门指南
- [用户手册](./user-guide/user-manual.md) - 详细功能使用说明
- [功能介绍](./user-guide/features.md) - 核心功能概览
- [常见问题](./user-guide/faq.md) - 疑难问题解答

### 🚀 部署运维

- [安装指南](./deployment/installation.md) - 环境搭建和安装步骤
- [配置说明](./deployment/configuration.md) - 系统配置和环境变量
- [故障排除](./deployment/troubleshooting.md) - 常见问题解决方案

## 📝 文档维护规范

### 文档更新原则

1. **及时更新**：功能变更后立即更新相关文档
2. **版本控制**：重要文档变更需要记录版本信息
3. **交叉引用**：相关文档之间建立链接关系
4. **简洁明了**：使用清晰的标题和结构化内容

### 文档编写规范

- 使用Markdown格式
- 统一的标题层级和格式
- 包含目录和导航链接
- 添加代码示例和图片说明
- 定期review和更新

### 贡献指南

- 新增文档请放在对应的分类目录下
- 更新现有文档请保持原有结构
- 重大变更请在README中更新导航
- 提交前请检查链接和格式

## 🔄 文档状态与版本

### 📊 文档状态总览

| 文档名称               | 版本   | 状态       | 最后更新 | 负责人 |
| ---------------------- | ------ | ---------- | -------- | ------ |
| **架构设计**           |        |            |          |        |
| system-architecture.md | v1.2.0 | 🟢 CURRENT | T0.1     | 开发者 |
| data-models.md         | v1.0.0 | 🟢 CURRENT | T0.1     | 开发者 |
| **开发指南**           |        |            |          |        |
| development-plan.md    | v1.1.0 | 🟢 CURRENT | T0.1     | 开发者 |
| project-rules.md       | v1.1.0 | 🟢 CURRENT | T0.1     | 开发者 |
| coding-standards.md    | v1.0.0 | 🟢 CURRENT | T0.1     | 开发者 |
| **设计规范**           |        |            |          |        |
| logo-specification.md  | v1.0.0 | 🟢 CURRENT | T0.1     | 开发者 |
| ui-design.md           | v1.0.0 | 🚧 DRAFT   | 预计T8   | 开发者 |
| **API文档**            |        |            |          |        |
| api-reference.md       | v1.0.0 | 🚧 DRAFT   | 预计T5   | 开发者 |
| **用户指南**           |        |            |          |        |
| user-manual.md         | v1.0.0 | 🚧 DRAFT   | 预计T16  | 开发者 |
| **部署运维**           |        |            |          |        |
| installation.md        | v1.0.0 | 📋 计划中  | -        | 开发者 |

### 🏷️ 状态标识说明

- 🟢 **CURRENT** - 当前版本，推荐使用
- 🟡 **OUTDATED** - 过时版本，计划更新
- 🔴 **DEPRECATED** - 已废弃，不再维护
- 🚧 **DRAFT** - 草稿状态，开发中
- 📋 **PLANNED** - 计划创建

### 📅 版本控制

- 查看详细变更历史：[CHANGELOG.md](./CHANGELOG.md)
- 时间戳参考：[TIMESTAMP_REFERENCE.md](./TIMESTAMP_REFERENCE.md)
- 项目工具：[tools/README.md](./tools/README.md)
- 版本格式：`主版本.次版本.修订版本`
- 时间戳格式：`T{天数}` 或 `T{天数}.{小时}`
- 文档审查周期：T30(月度)/T90(季度)/T365(年度)

### 🛠️ 时间戳工具

```bash
# 获取当前项目时间戳
npm run timestamp:current

# 转换时间戳
node docs/tools/timestamp-helper.js convert T1.5

# 更新文档时间戳
npm run docs:update docs/README.md
```

## 📞 联系方式

如有文档相关问题或建议，请通过以下方式联系：

- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **技术支持**：linhuinan542@gmail.com
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)

---

**文档导航版本**：v1.2.0  
**最后更新**：T0.1  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
