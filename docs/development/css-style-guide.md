# InkDot CSS样式系统规范

> **文档版本**：v1.0.0
> **创建时间戳**：T275.3
> **最后更新**：T275.3
> **状态**：🟢 CURRENT
> **维护者**：InkDot开发团队
> **下次审查**：T305.3

## 📋 样式系统概览

InkDot项目采用模块化的CSS架构，遵循极简主义设计原则，建立了完整的设计令牌系统和响应式布局框架。

### 🎯 设计目标

- **极简主义美学**：黑白灰为主色调，点缀使用品牌色
- **设计系统统一**：通过CSS变量确保视觉一致性
- **响应式优先**：Mobile First策略，完美适配各种设备
- **可访问性友好**：支持高对比度、减少动画、屏幕阅读器
- **性能优化**：最小化CSS体积，优化加载和渲染性能

## 🗂️ 文件结构

```
src/assets/styles/
├── index.css           # 样式系统入口文件
├── tokens.css          # 设计令牌和CSS变量
├── base.css           # 基础重置和全局样式
├── layout.css         # 布局系统和网格
├── components.css     # 组件样式库
├── utilities.css      # 工具类系统
├── themes.css         # 主题系统
└── responsive.css     # 响应式设计
```

### 📦 导入顺序

```css
/* 正确的导入顺序 */
@import './tokens.css'; /* 1. CSS变量和设计令牌 */
@import './base.css'; /* 2. 基础重置和全局样式 */
@import './layout.css'; /* 3. 布局系统 */
@import './components.css'; /* 4. 组件样式 */
@import './utilities.css'; /* 5. 工具类 */
@import './themes.css'; /* 6. 主题系统 */
@import './responsive.css'; /* 7. 响应式断点 */
```

## 🎨 设计令牌系统

### 色彩系统

```css
:root {
  /* 主色调 - 极简黑白灰 */
  --color-primary: #000000;
  --color-secondary: #ffffff;
  --color-background: #ffffff;
  --color-surface: #f8f9fa;

  /* 文本色彩 */
  --color-text-primary: #000000;
  --color-text-secondary: #6c757d;
  --color-text-muted: #9ca3af;

  /* 功能色彩 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### 间距系统

```css
:root {
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-4: 1rem; /* 16px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
}
```

### 字体系统

```css
:root {
  /* 中文优化字体栈 */
  --font-family-sans:
    -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC',
    'WenQuanYi Micro Hei', system-ui, sans-serif;

  /* 字号系统 */
  --font-size-xs: 0.75rem; /* 12px */
  --font-size-sm: 0.875rem; /* 14px */
  --font-size-base: 1rem; /* 16px */
  --font-size-lg: 1.125rem; /* 18px */
  --font-size-xl: 1.25rem; /* 20px */
}
```

## 🧩 组件样式规范

### 按钮组件

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-weight: var(--font-weight-medium);
  transition: all var(--duration-fast) var(--easing-smooth);
}

/* 尺寸变体 */
.btn-sm {
  height: var(--button-height-sm);
}
.btn-base {
  height: var(--button-height-base);
}
.btn-lg {
  height: var(--button-height-lg);
}

/* 样式变体 */
.btn-primary {
  /* 主要按钮样式 */
}
.btn-secondary {
  /* 次要按钮样式 */
}
.btn-ghost {
  /* 幽灵按钮样式 */
}
```

### 输入框组件

```css
.input {
  width: 100%;
  height: var(--input-height-base);
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--easing-smooth);
}

.input:focus {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 var(--focus-ring-width) var(--focus-ring-color);
}
```

## 🛠️ 工具类系统

### 间距工具类

```css
/* Padding */
.p-0 {
  padding: var(--space-0);
}
.p-2 {
  padding: var(--space-2);
}
.p-4 {
  padding: var(--space-4);
}

/* Margin */
.m-0 {
  margin: var(--space-0);
}
.m-2 {
  margin: var(--space-2);
}
.m-4 {
  margin: var(--space-4);
}

/* 轴向间距 */
.px-4 {
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}
.py-4 {
  padding-top: var(--space-4);
  padding-bottom: var(--space-4);
}
```

### 字体工具类

```css
/* 字号 */
.text-xs {
  font-size: var(--font-size-xs);
}
.text-sm {
  font-size: var(--font-size-sm);
}
.text-base {
  font-size: var(--font-size-base);
}

/* 字重 */
.font-normal {
  font-weight: var(--font-weight-normal);
}
.font-medium {
  font-weight: var(--font-weight-medium);
}
.font-semibold {
  font-weight: var(--font-weight-semibold);
}

/* 文本颜色 */
.text-primary {
  color: var(--color-text-primary);
}
.text-secondary {
  color: var(--color-text-secondary);
}
.text-muted {
  color: var(--color-text-muted);
}
```

### 布局工具类

```css
/* Display */
.block {
  display: block;
}
.flex {
  display: flex;
}
.grid {
  display: grid;
}
.hidden {
  display: none;
}

/* Flexbox */
.items-center {
  align-items: center;
}
.justify-center {
  justify-content: center;
}
.justify-between {
  justify-content: space-between;
}

/* Position */
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.fixed {
  position: fixed;
}
```

## 📱 响应式设计

### 断点系统

```css
/* Mobile First 策略 */
/* 基础样式: < 640px (手机) */
@media (min-width: 640px) {
  /* 大手机 */
}
@media (min-width: 768px) {
  /* 平板 */
}
@media (min-width: 1024px) {
  /* 小桌面 */
}
@media (min-width: 1280px) {
  /* 大桌面 */
}
@media (min-width: 1536px) {
  /* 超大桌面 */
}
```

### 响应式工具类

```css
/* 显示控制 */
.mobile-only {
  display: block;
}
.tablet-only {
  display: none;
}
.desktop-only {
  display: none;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .mobile-only {
    display: none;
  }
  .tablet-only {
    display: block;
  }
}

@media (min-width: 1024px) {
  .mobile-only {
    display: none;
  }
  .tablet-only {
    display: none;
  }
  .desktop-only {
    display: block;
  }
}
```

## 🌗 主题系统

### 主题切换

```css
/* 浅色主题（默认） */
:root {
  --color-background: #ffffff;
  --color-text-primary: #000000;
  color-scheme: light;
}

/* 深色主题 */
[data-theme='dark'] {
  --color-background: #0f0f0f;
  --color-text-primary: #ffffff;
  color-scheme: dark;
}

/* 高对比度主题 */
[data-theme='high-contrast'] {
  --color-background: #ffffff;
  --color-text-primary: #000000;
  /* 增强对比度 */
}
```

### 系统主题跟随

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    /* 自动应用深色主题变量 */
  }
}
```

## 🚀 最佳实践

### CSS变量使用

```css
/* ✅ 正确：使用设计令牌 */
.button {
  background-color: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-md);
}

/* ❌ 错误：硬编码值 */
.button {
  background-color: #000000;
  padding: 16px;
  border-radius: 8px;
}
```

### 命名规范

```css
/* ✅ 正确：语义化命名 */
.btn-primary {
}
.card-header {
}
.text-muted {
}

/* ❌ 错误：样式化命名 */
.black-button {
}
.big-text {
}
.red-border {
}
```

### 组件样式组织

```css
/* 基础样式 */
.card {
  /* 布局相关 */
  display: flex;
  flex-direction: column;

  /* 外观相关 */
  background-color: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);

  /* 其他 */
  overflow: hidden;
}

/* 变体样式 */
.card-elevated {
  box-shadow: var(--shadow-md);
}

/* 状态样式 */
.card:hover {
  box-shadow: var(--shadow-lg);
}
```

## 🔧 开发工具

### CSS检查清单

- [ ] 使用CSS变量而非硬编码值
- [ ] 遵循移动优先的响应式设计
- [ ] 组件支持主题切换
- [ ] 符合可访问性标准
- [ ] 样式文件按模块组织

### 调试技巧

```css
/* 调试边框（开发时使用） */
.debug * {
  outline: 1px solid red !important;
}

/* 调试网格 */
.debug-grid {
  background-image:
    linear-gradient(rgba(255, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

### 性能优化

```css
/* 使用GPU加速 */
.animate {
  transform: translateZ(0);
  will-change: transform;
}

/* 避免重排的动画 */
.fade-in {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 300ms,
    transform 300ms;
}

.fade-in.active {
  opacity: 1;
  transform: translateY(0);
}
```

## 📚 扩展阅读

- [CSS自定义属性指南](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
- [响应式设计最佳实践](https://web.dev/responsive-web-design-basics/)
- [CSS架构指南](https://maintainablecss.com/)
- [无障碍设计规范](https://www.w3.org/WAI/WCAG21/quickref/)

---

**注意**：本文档是CSS样式系统的规范指南，所有开发者都应遵循这些规范以确保代码的一致性和可维护性。如有疑问或建议，请联系设计团队。
