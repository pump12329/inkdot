# InkDot 示例文件

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.1  
> **最后更新**：T0.3  
> **状态**：CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本目录包含InkDot项目的各种示例和演示文件。

## 📁 文件说明

### 演示文件

- `demo.html` - 通用演示页面
- `react-demo.html` - React组件演示
- `vue-demo.html` - Vue组件演示
- `test.html` - 测试页面

## 🚀 使用方法

### 本地预览

```bash
# 使用Python简单服务器
python3 -m http.server 8000

# 或使用Node.js serve
npx serve examples

# 然后在浏览器中访问
# http://localhost:8000/demo.html
# http://localhost:8000/react-demo.html
# http://localhost:8000/vue-demo.html
```

### 组件引用

```javascript
// Vue组件
import { InkDotLogo } from '../src/components';

// React组件
import { InkDotLogoReact } from '../src/components';

// 直接HTML引用
<script src="../src/components/InkDotLogo.vue"></script>;
```

## 📝 开发说明

- 所有示例文件都引用 `../src/` 目录下的组件
- 确保在正确的目录下运行服务器
- 示例文件用于展示组件功能和用法

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
