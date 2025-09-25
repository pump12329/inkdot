# InkDot 项目初期开发指南

> **文档版本**：v1.0.0  
> **创建时间戳**：T0.4  
> **最后更新**：T0.4  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.4

## 📋 概述

本文档为InkDot项目的初期开发阶段提供全面的指导，包括项目设置、开发环境配置、工作流程、编码规范和最佳实践。适用于新加入项目的开发者快速上手。

## 🎯 项目目标

### 核心愿景

创建一个基于AI的创意创作思维导图平台，帮助用户通过可视化思维导图进行创意写作和内容创作。

### 主要功能

- **智能思维导图编辑**：直观的节点创建、编辑和连接
- **AI辅助创作**：集成DeepSeek和OpenRouter API提供智能建议
- **实时协作**：支持多用户实时编辑和分享
- **模板系统**：提供多种创作模板和主题
- **导出功能**：支持多种格式导出（PNG、PDF、Markdown等）

## 🏗️ 技术架构

### 技术栈

- **前端框架**：Vue 3 + TypeScript
- **状态管理**：Pinia
- **构建工具**：Vite
- **UI组件库**：Element Plus
- **样式方案**：Tailwind CSS + SCSS
- **图表库**：D3.js 或 ECharts
- **AI集成**：DeepSeek API + OpenRouter API

### 项目结构

```
inkdot/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # Vue组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # Pinia状态管理
│   │   ├── services/       # API服务
│   │   ├── utils/          # 工具函数
│   │   └── types/          # TypeScript类型定义
│   ├── public/             # 静态资源
│   └── tests/              # 测试文件
├── backend/                 # 后端服务（可选）
├── docs/                   # 项目文档
├── tools/                  # 开发工具
└── examples/               # 示例和演示
```

## 🚀 开发环境设置

### 系统要求

- **Node.js**：>= 18.0.0
- **npm**：>= 8.0.0 或 **yarn**：>= 1.22.0
- **Git**：>= 2.30.0
- **现代浏览器**：Chrome 90+, Firefox 88+, Safari 14+

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/pump12329/inkdot.git
cd inkdot
```

#### 2. 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

#### 3. 环境配置

```bash
# 复制环境变量模板
cp .env.example .env.local

# 编辑环境变量
# 配置API密钥和开发环境设置
```

#### 4. 启动开发服务器

```bash
# 启动前端开发服务器
npm run dev

# 启动后端开发服务器（如果有）
npm run dev:backend
```

### 开发工具配置

#### VS Code 推荐插件

```json
{
  "recommendations": [
    "Vue.volar",
    "Vue.vscode-typescript-vue-plugin",
    "bradlc.vscode-tailwindcss",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### ESLint 配置

项目使用严格的ESLint规则确保代码质量：

```bash
# 检查代码风格
npm run lint

# 自动修复代码风格问题
npm run lint:fix
```

## 🔄 开发工作流

### Git 工作流

#### 分支策略

- **main**：主分支，稳定版本
- **develop**：开发分支，集成最新功能
- **feature/\***：功能分支，开发新功能
- **hotfix/\***：热修复分支，修复紧急问题

#### 提交规范

使用 Conventional Commits 规范：

```bash
# 功能开发
git commit -m "feat: 添加用户认证功能"

# 问题修复
git commit -m "fix: 修复登录页面样式问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 调整按钮颜色和间距"
```

### 开发流程

#### 1. 创建功能分支

```bash
git checkout develop
git pull origin develop
git checkout -b feature/user-authentication
```

#### 2. 开发功能

- 编写代码
- 添加测试
- 更新文档
- 运行测试和检查

#### 3. 提交代码

```bash
git add .
git commit -m "feat: 实现用户登录功能"
git push origin feature/user-authentication
```

#### 4. 创建Pull Request

- 在GitHub上创建PR
- 添加详细的描述和测试说明
- 请求代码审查

#### 5. 代码审查和合并

- 审查者检查代码质量
- 通过所有测试后合并到develop
- 删除功能分支

### 自动化工具

#### 预提交检查

```bash
# 安装husky和lint-staged
npm install --save-dev husky lint-staged

# 配置pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
```

#### CI/CD 配置

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

## 📝 编码规范

### TypeScript 规范

#### 类型定义

```typescript
// 接口定义
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// 类型别名
type Theme = 'light' | 'dark';

// 泛型使用
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
```

#### 组件定义

```typescript
// Vue 3 Composition API
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User } from '@/types'

// Props 定义
interface Props {
  user: User
  theme?: Theme
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})

// Emits 定义
interface Emits {
  update: [user: User]
}

const emit = defineEmits<Emits>()

// 响应式数据
const isLoading = ref(false)

// 计算属性
const displayName = computed(() =>
  props.user.name || props.user.email
)

// 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>
```

### Vue 3 最佳实践

#### 组件结构

```vue
<template>
  <!-- 模板内容 -->
  <div class="user-card">
    <h3>{{ displayName }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup lang="ts">
// 脚本内容
</script>

<style scoped>
/* 样式内容 */
.user-card {
  @apply bg-white rounded-lg shadow-md p-4;
}
</style>
```

#### 状态管理

```typescript
// stores/user.ts
import { defineStore } from 'pinia';
import type { User } from '@/types';

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null);
  const isLoading = ref(false);

  const login = async (email: string, password: string) => {
    isLoading.value = true;
    try {
      const user = await authService.login(email, password);
      currentUser.value = user;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    currentUser,
    isLoading,
    login
  };
});
```

### CSS 规范

#### Tailwind CSS 使用

```vue
<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
    <h2 class="text-xl font-semibold text-gray-800">标题</h2>
    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">按钮</button>
  </div>
</template>
```

#### 自定义样式

```scss
// styles/components.scss
.user-avatar {
  @apply w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center;

  &.large {
    @apply w-16 h-16;
  }

  img {
    @apply w-full h-full rounded-full object-cover;
  }
}
```

## 🧪 测试策略

### 测试类型

#### 单元测试

```typescript
// tests/utils/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from '@/utils/formatDate';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('2024-01-15');
  });
});
```

#### 组件测试

```typescript
// tests/components/UserCard.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UserCard from '@/components/UserCard.vue';

describe('UserCard', () => {
  it('should render user information', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };

    const wrapper = mount(UserCard, {
      props: { user }
    });

    expect(wrapper.text()).toContain('John Doe');
    expect(wrapper.text()).toContain('john@example.com');
  });
});
```

#### E2E 测试

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  await expect(page).toHaveURL('/dashboard');
});
```

### 测试命令

```bash
# 运行所有测试
npm run test

# 运行单元测试
npm run test:unit

# 运行组件测试
npm run test:component

# 运行E2E测试
npm run test:e2e

# 生成测试覆盖率报告
npm run test:coverage
```

## 🔧 开发工具

### 项目工具

#### 时间戳工具

```bash
# 获取当前时间戳
npm run timestamp:current

# 更新文档时间戳
npm run docs:update docs/development/initial-development-guide.md
```

#### CHANGELOG工具

```bash
# 自动更新CHANGELOG
npm run changelog:update

# 手动添加变更条目
npm run change:add -- --type feat --description "添加新功能"
```

#### 文档状态工具

```bash
# 更新文档状态总览
npm run status:update

# 检查文档状态一致性
npm run status:check
```

### 调试工具

#### Vue DevTools

- 安装浏览器扩展
- 查看组件状态和Props
- 监控Pinia状态变化

#### 浏览器调试

```typescript
// 开发环境下的调试信息
if (import.meta.env.DEV) {
  console.log('Debug info:', { user, theme, settings });
}
```

## 📦 构建和部署

### 构建配置

#### 开发构建

```bash
# 启动开发服务器
npm run dev

# 构建开发版本
npm run build:dev
```

#### 生产构建

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署策略

#### 静态部署

```bash
# 构建静态文件
npm run build

# 部署到GitHub Pages
npm run deploy:gh-pages

# 部署到Netlify
npm run deploy:netlify
```

#### Docker 部署

```dockerfile
# Dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🚨 常见问题

### 开发环境问题

#### Node.js 版本问题

```bash
# 检查Node.js版本
node --version

# 使用nvm管理Node.js版本
nvm install 18
nvm use 18
```

#### 依赖安装问题

```bash
# 清除缓存
npm cache clean --force

# 删除node_modules重新安装
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript 类型错误

```bash
# 重新生成类型定义
npm run type-check

# 检查Vue类型支持
npm run vue-tsc --noEmit
```

### 构建问题

#### 内存不足

```bash
# 增加Node.js内存限制
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### 依赖冲突

```bash
# 检查依赖树
npm ls

# 更新依赖
npm update
```

## 📚 学习资源

### 官方文档

- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

### 推荐教程

- [Vue 3 + TypeScript 最佳实践](https://vuejs.org/guide/typescript/overview.html)
- [Tailwind CSS 使用指南](https://tailwindcss.com/docs)
- [Element Plus 组件库](https://element-plus.org/)

### 开发工具

- [VS Code Vue 插件](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [Vue DevTools](https://devtools.vuejs.org/)

## 🤝 贡献指南

### 如何贡献

#### 1. Fork 项目

- 在GitHub上Fork项目
- 克隆你的Fork到本地

#### 2. 创建功能分支

```bash
git checkout -b feature/your-feature-name
```

#### 3. 开发和测试

- 编写代码
- 添加测试
- 运行测试确保通过

#### 4. 提交代码

```bash
git commit -m "feat: 添加你的功能描述"
```

#### 5. 创建Pull Request

- 推送到你的Fork
- 创建Pull Request到主项目

### 代码审查

#### 审查标准

- 代码质量和可读性
- 测试覆盖率
- 文档完整性
- 性能影响

#### 审查流程

1. 自动检查（CI/CD）
2. 人工代码审查
3. 测试验证
4. 合并或反馈

## 📞 支持与联系

### 获取帮助

- **项目Issues**：[GitHub Issues](https://github.com/pump12329/inkdot/issues)
- **技术支持**：linhuinan542@gmail.com
- **社区讨论**：[GitHub Discussions](https://github.com/pump12329/inkdot/discussions)

### 开发团队

- **项目维护者**：pump12329
- **技术负责人**：InkDot开发团队
- **文档维护**：InkDot开发团队

---

**文档版本**：v1.0.0  
**最后更新**：T0.4  
**维护者**：InkDot开发团队
