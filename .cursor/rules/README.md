# InkDot 开发规则

> **文档版本**：v2.0.0
> **创建时间戳**：T0.15
> **最后更新**：T0.15
> **状态**：CURRENT
> **维护者**：InkDot开发团队
> **下次审查**：T30.15

## 📋 规则概述

本目录包含InkDot项目的所有开发规则，这些规则为Cursor AI提供项目特定的开发指导。

## 📁 规则文件结构

### 🎯 项目规则

- **`project-info.mdc`** - 项目基本信息和技术栈
- **`timestamp-system.mdc`** - 时间戳系统规范
- **`documentation-structure.mdc`** - 文档结构规范

### 🏗️ 架构规则

- **`architecture.mdc`** - 系统架构设计规范
- **`frontend-development.mdc`** - 前端开发规范
- **`backend-development.mdc`** - 后端开发规范
- **`testing-standards.mdc`** - 测试标准规范

### 🎨 设计规则

- **`design-system.mdc`** - 设计系统规范
- **`ai-integration.mdc`** - AI集成规范

### 🚀 开发流程规则

- **`initial-development.mdc`** - 初始项目开发规则
- **`development-workflow.mdc`** - 开发工作流程规范
- **`mvp-development.mdc`** - MVP开发策略规范

## 🔧 规则使用说明

### 规则优先级

1. **`project-info.mdc`** - 项目基本信息（总是应用）
2. **`frontend-development.mdc`** - 前端开发规范（总是应用）
3. **`testing-standards.mdc`** - 测试标准规范（总是应用）
4. **`project-tools.mdc`** - 项目工具使用规范（总是应用）
5. **`initial-development.mdc`** - 初始开发阶段
6. **`architecture.mdc`** - 架构设计规范
7. **`ai-integration.mdc`** - AI功能开发
8. **`mvp-development.mdc`** - MVP开发策略
9. **`development-workflow.mdc`** - 日常开发流程
10. **其他规则** - 按需应用

### 规则应用场景

- **新功能开发**：应用 `frontend-development.mdc` + `testing-standards.mdc`
- **架构设计**：应用 `architecture.mdc` + `frontend-development.mdc`
- **测试编写**：应用 `testing-standards.mdc` + `project-tools.mdc`
- **AI功能开发**：应用 `ai-integration.mdc` + `frontend-development.mdc`
- **项目工具使用**：应用 `project-tools.mdc`
- **文档更新**：应用 `documentation-structure.mdc` + `project-tools.mdc`
- **环境设置**：应用 `project-tools.mdc` + `initial-development.mdc`

## 📋 规则维护

### 更新流程

1. **识别需求**：发现规则需要更新
2. **修改规则**：更新相应的 `.mdc` 文件
3. **测试验证**：确保规则正确应用
4. **文档同步**：更新相关文档
5. **团队通知**：通知团队规则变更

### 规则审查

- **定期审查**：每月审查一次规则有效性
- **问题反馈**：及时处理规则相关问题
- **持续改进**：基于项目发展调整规则
- **版本管理**：维护规则版本历史

## 🎯 规则特点

### 针对性

- 基于Vue 3 + TypeScript技术栈
- 针对思维导图应用特点
- 考虑AI集成需求
- 支持MVP开发策略

### 实用性

- 提供具体的代码示例
- 包含完整的开发流程
- 涵盖测试和部署规范
- 支持渐进式开发

### 可维护性

- 模块化规则结构
- 清晰的规则分类
- 易于更新和扩展
- 支持版本管理

## 📚 相关文档

### 项目文档

- [项目结构文档](../PROJECT_STRUCTURE.md)
- [开发计划文档](../docs/development/development-plan.md)
- [编码规范文档](../docs/development/coding-standards.md)

### 技术文档

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)

## 🔄 规则更新历史

### v2.0.0 (T0.15)

- 重构规则结构，采用模块化设计
- 添加初始开发规则和MVP开发策略
- 整合前端开发规范
- 优化开发工作流程

### v1.0.0 (T0.1)

- 初始规则集创建
- 基础开发规范建立
- 时间戳系统集成

## 📞 支持与反馈

### 问题报告

- 规则问题：在项目Issues中报告
- 改进建议：通过PR提交
- 紧急问题：直接联系维护者

### 贡献指南

1. Fork项目
2. 创建功能分支
3. 修改规则文件
4. 提交PR
5. 等待审查合并

---

**文档版本**：v2.0.0
**最后更新**：T0.15
**状态**：🟢 CURRENT
**维护者**：InkDot开发团队
**下次审查**：T30.15
