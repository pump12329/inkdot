# InkDot 源代码

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本目录包含InkDot项目的核心源代码文件。

## 📁 目录结构

```
src/
├── components/          # Vue/React组件
│   ├── InkDotLogo.vue  # Vue Logo组件
│   ├── InkDotLogo.tsx  # React Logo组件
│   ├── InkDotLogo.jsx  # JSX Logo组件
│   └── index.ts        # 组件导出文件
├── composables/        # Vue 3 组合式函数
├── stores/            # Pinia状态管理
├── types/             # TypeScript类型定义
│   └── index.ts       # 核心类型定义
├── utils/             # 工具函数
├── services/          # API服务
├── assets/            # 静态资源
│   ├── logo.svg       # Logo SVG文件
│   └── logo.css       # Logo样式文件
└── styles/            # 全局样式
```

## 🎯 核心组件

### InkDotLogo 组件
- **Vue版本**: `components/InkDotLogo.vue`
- **React版本**: `components/InkDotLogo.tsx`
- **JSX版本**: `components/InkDotLogo.jsx`

### 类型定义
- **核心类型**: `types/index.ts`
- 包含所有项目相关的TypeScript接口

## 🚀 开发指南

### 组件开发
1. 在 `components/` 目录创建新组件
2. 在 `components/index.ts` 中导出
3. 添加相应的类型定义到 `types/`

### 工具函数
1. 在 `utils/` 目录创建工具函数
2. 使用TypeScript严格模式
3. 添加完整的类型注解

### 状态管理
1. 使用Pinia进行状态管理
2. 在 `stores/` 目录创建store
3. 遵循Vue 3 Composition API规范

## 📝 编码规范

请参考 `docs/development/coding-standards.md` 了解详细的编码规范。

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
