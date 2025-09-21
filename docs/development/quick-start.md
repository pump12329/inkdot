# InkDot 快速开始指南

> **文档版本**：v1.0.0  
> **最后更新**：T0.1  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.1

## 🚀 5分钟快速上手

### 1. 环境检查
```bash
# 检查Node.js版本 (需要v18+)
node --version

# 检查npm版本
npm --version

# 如果没有Node.js，请访问 https://nodejs.org 下载安装
```

### 2. 项目初始化
```bash
# 克隆项目 (如果从GitHub)
git clone https://github.com/your-username/inkdot.git
cd inkdot

# 或者直接在当前目录开始
npm init -y
```

### 3. 安装依赖
```bash
# 安装核心依赖
npm install vue@next @vue/composition-api pinia
npm install -D vite @vitejs/plugin-vue typescript

# 安装开发工具
npm install -D eslint prettier @typescript-eslint/parser
```

### 4. 创建基础文件
```bash
# 创建Vite配置
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
EOF

# 创建TypeScript配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
```

### 5. 创建第一个组件
```bash
# 创建主应用文件
mkdir -p src
cat > src/main.ts << 'EOF'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
EOF

# 创建App.vue
cat > src/App.vue << 'EOF'
<template>
  <div id="app">
    <h1>InkDot - 创意创作平台</h1>
    <MindMapCanvas />
  </div>
</template>

<script setup lang="ts">
import MindMapCanvas from './components/MindMapCanvas.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
EOF

# 创建思维导图组件
mkdir -p src/components
cat > src/components/MindMapCanvas.vue << 'EOF'
<template>
  <div class="mind-map-canvas">
    <svg :width="width" :height="height">
      <circle
        v-for="node in nodes"
        :key="node.id"
        :cx="node.x"
        :cy="node.y"
        r="30"
        fill="#4CAF50"
        @click="selectNode(node.id)"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const width = 800
const height = 600

const nodes = ref([
  { id: '1', x: 100, y: 100 },
  { id: '2', x: 200, y: 200 },
  { id: '3', x: 300, y: 150 }
])

function selectNode(nodeId: string) {
  console.log('选中节点:', nodeId)
}
</script>

<style scoped>
.mind-map-canvas {
  border: 1px solid #ccc;
  margin: 20px auto;
}
</style>
EOF
```

### 6. 创建HTML入口
```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/logo.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>InkDot - 创意创作平台</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
EOF
```

### 7. 启动开发服务器
```bash
# 启动开发服务器
npm run dev

# 或者使用Vite直接启动
npx vite
```

### 8. 打开浏览器
访问 `http://localhost:5173` 查看你的第一个InkDot应用！

## 🎯 下一步开发

### 添加状态管理
```bash
# 创建Pinia store
mkdir -p src/stores
cat > src/stores/mindMap.ts << 'EOF'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMindMapStore = defineStore('mindMap', () => {
  const nodes = ref([])
  const selectedNodeId = ref(null)

  function addNode(node) {
    nodes.value.push(node)
  }

  function selectNode(id) {
    selectedNodeId.value = id
  }

  return { nodes, selectedNodeId, addNode, selectNode }
})
EOF
```

### 添加AI功能
```bash
# 创建AI服务
mkdir -p src/services
cat > src/services/ai.ts << 'EOF'
export class AIService {
  async generateText(prompt: string): Promise<string> {
    // 这里集成你的AI API
    return `AI生成的内容: ${prompt}`
  }
}
EOF
```

### 添加时间戳工具
```bash
# 使用项目自带的时间戳工具
npm run timestamp:current
npm run docs:update docs/README.md
```

## 🔧 常用命令

```bash
# 开发相关
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览构建结果

# 代码质量
npm run lint             # 代码检查
npm run type-check       # 类型检查

# 文档相关
npm run timestamp:current # 获取当前时间戳
npm run docs:update <文件> # 更新文档时间戳
npm run docs:header v1.0.0 T0.1 # 生成文档头部

# Git相关
git add .                # 添加所有文件
git commit -m "feat: 添加功能 T0.1" # 提交代码
git push origin main     # 推送到远程仓库
```

## 🐛 常见问题

### Q: 端口被占用怎么办？
```bash
# 解决方案：使用其他端口
npm run dev -- --port 3000
```

### Q: TypeScript报错？
```bash
# 解决方案：重启TypeScript服务
# 在VSCode中按 Ctrl+Shift+P，输入 "TypeScript: Restart TS Server"
```

### Q: 依赖安装失败？
```bash
# 解决方案：清理缓存
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📚 学习资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
