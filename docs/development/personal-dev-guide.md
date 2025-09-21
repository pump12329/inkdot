# InkDot 个人开发者指南

> **文档版本**：v1.0.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本指南专为个人开发者设计，提供实用的开发流程、工具配置和最佳实践，帮助高效开发InkDot项目。

## 🚀 快速开始

### 环境准备
```bash
# 1. 安装Node.js (推荐v18+)
node --version

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 获取当前时间戳
npm run timestamp:current
```

### 项目结构速览
```
inkdot/
├── src/                    # 源代码
│   ├── ui/                # 前端界面 (Vue 3)
│   ├── core/              # 核心逻辑
│   ├── ai/                # AI功能
│   ├── services/          # 后端服务
│   └── plugins/           # 插件系统
├── docs/                  # 文档
├── examples/              # 示例文件
└── package.json           # 项目配置
```

## 🛠️ 开发工具配置

### VSCode/Cursor 推荐配置
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.vue": "vue"
  }
}
```

### 推荐扩展
- **Vue Language Features (Volar)** - Vue 3支持
- **TypeScript Importer** - 自动导入
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **GitLens** - Git增强

### 快捷键配置
```json
// .vscode/keybindings.json
[
  {
    "key": "ctrl+shift+t",
    "command": "workbench.action.terminal.new"
  },
  {
    "key": "ctrl+shift+d",
    "command": "workbench.action.quickOpen"
  }
]
```

## 📝 开发流程

### 1. 日常开发流程
```bash
# 开始新功能
git checkout -b feature/new-feature

# 开发过程中
npm run dev              # 启动开发服务器
npm run timestamp:current # 获取时间戳
npm run docs:update docs/README.md # 更新文档

# 提交代码
git add .
git commit -m "feat: 添加新功能 T0.1"
git push origin feature/new-feature
```

### 2. 文档更新流程
```bash
# 更新文档时间戳
npm run docs:update docs/README.md

# 生成新文档头部
npm run docs:header v1.0.0 T0.1

# 检查文档状态
find docs -name "*.md" -exec grep -l "T0.1" {} \;
```

### 3. 测试流程
```bash
# 运行测试
npm run test

# 检查代码质量
npm run lint

# 类型检查
npm run type-check
```

## 🎯 核心开发任务

### 阶段1：基础框架 (T0 - T7)

#### 任务1：设置Vue 3项目
```bash
# 创建Vue 3项目
npm create vue@latest inkdot-ui
cd inkdot-ui

# 安装必要依赖
npm install pinia @vueuse/core
npm install -D @types/node
```

#### 任务2：实现基础组件
```typescript
// src/ui/components/Button.vue
<template>
  <button 
    :class="buttonClasses" 
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

const buttonClasses = computed(() => ({
  'btn': true,
  [`btn-${props.variant}`]: true,
  [`btn-${props.size}`]: true,
  'btn-disabled': props.disabled
}))

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

#### 任务3：设置状态管理
```typescript
// src/ui/stores/mindMapStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMindMapStore = defineStore('mindMap', () => {
  // 状态
  const nodes = ref<MindMapNode[]>([])
  const selectedNodeId = ref<string | null>(null)
  const currentProject = ref<MindMapProject | null>(null)

  // 计算属性
  const selectedNode = computed(() => 
    nodes.value.find(node => node.id === selectedNodeId.value)
  )

  // 方法
  function addNode(node: MindMapNode) {
    nodes.value.push(node)
  }

  function selectNode(nodeId: string | null) {
    selectedNodeId.value = nodeId
  }

  return {
    nodes,
    selectedNodeId,
    currentProject,
    selectedNode,
    addNode,
    selectNode
  }
})
```

### 阶段2：思维导图核心 (T7 - T14)

#### 任务1：实现节点管理
```typescript
// src/core/mindmap/node-manager.ts
export class NodeManager {
  private nodes: Map<string, MindMapNode> = new Map()

  createNode(data: Partial<MindMapNode>): MindMapNode {
    const node: MindMapNode = {
      id: generateId(),
      content: data.content || '',
      position: data.position || { x: 0, y: 0 },
      type: data.type || 'text',
      tags: data.tags || [],
      connections: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    }
    
    this.nodes.set(node.id, node)
    return node
  }

  updateNode(id: string, updates: Partial<MindMapNode>): boolean {
    const node = this.nodes.get(id)
    if (!node) return false

    const updatedNode = { ...node, ...updates, updatedAt: new Date() }
    this.nodes.set(id, updatedNode)
    return true
  }

  deleteNode(id: string): boolean {
    return this.nodes.delete(id)
  }

  getNode(id: string): MindMapNode | null {
    return this.nodes.get(id) || null
  }

  getAllNodes(): MindMapNode[] {
    return Array.from(this.nodes.values())
  }
}
```

#### 任务2：实现Canvas渲染
```vue
<!-- src/ui/components/MindMapCanvas.vue -->
<template>
  <div class="mind-map-canvas" ref="canvasRef">
    <svg 
      :width="canvasSize.width" 
      :height="canvasSize.height"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    >
      <!-- 连接线 -->
      <g class="connections">
        <path
          v-for="connection in connections"
          :key="connection.id"
          :d="getConnectionPath(connection)"
          class="connection"
        />
      </g>
      
      <!-- 节点 -->
      <g class="nodes">
        <MindMapNode
          v-for="node in nodes"
          :key="node.id"
          :node="node"
          :selected="selectedNodeId === node.id"
          @select="selectNode"
          @update="updateNode"
        />
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useMindMapStore } from '@/ui/stores/mindMapStore'
import MindMapNode from './MindMapNode.vue'

const mindMapStore = useMindMapStore()
const canvasRef = ref<HTMLElement>()

const nodes = computed(() => mindMapStore.nodes)
const selectedNodeId = computed(() => mindMapStore.selectedNodeId)
const connections = computed(() => mindMapStore.connections)

const canvasSize = ref({ width: 800, height: 600 })

function selectNode(nodeId: string) {
  mindMapStore.selectNode(nodeId)
}

function updateNode(nodeId: string, updates: Partial<MindMapNode>) {
  mindMapStore.updateNode(nodeId, updates)
}

// 鼠标事件处理
function handleMouseDown(event: MouseEvent) {
  // 实现拖拽逻辑
}

function handleMouseMove(event: MouseEvent) {
  // 实现拖拽逻辑
}

function handleMouseUp(event: MouseEvent) {
  // 实现拖拽逻辑
}

function getConnectionPath(connection: Connection): string {
  // 计算连接线路径
  return ''
}
</script>
```

### 阶段3：AI集成 (T14 - T21)

#### 任务1：设置AI API
```typescript
// src/services/api/ai-api.ts
export class AIApi {
  private apiKey: string
  private baseURL: string

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey
    this.baseURL = baseURL
  }

  async generateText(prompt: string, options: AIGenerateOptions): Promise<string> {
    const response = await fetch(`${this.baseURL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        prompt,
        ...options
      })
    })

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.text
  }

  async analyzeContent(content: string): Promise<AIAnalysis> {
    // 实现内容分析
    return {
      sentiment: 'positive',
      complexity: 'medium',
      keywords: ['keyword1', 'keyword2'],
      suggestions: ['suggestion1', 'suggestion2'],
      relatedTopics: ['topic1', 'topic2'],
      quality: 85
    }
  }
}
```

#### 任务2：实现AI Agent
```typescript
// src/ai/agents/novel-agent.ts
import { BaseAgent } from './base-agent'

export class NovelAgent extends BaseAgent {
  id = 'novel-agent'
  name = '小说创作助手'
  description = '专门用于小说创作的AI助手'
  capabilities = ['generate-plot', 'create-character', 'world-building']

  async execute(input: AgentInput): Promise<AgentOutput> {
    try {
      switch (input.type) {
        case 'text':
          return await this.generateContent(input.content, input.context)
        case 'mindmap':
          return await this.analyzeMindMap(input.content)
        default:
          throw new Error(`Unsupported input type: ${input.type}`)
      }
    } catch (error) {
      return this.handleError(error as Error)
    }
  }

  private async generateContent(prompt: string, context?: any): Promise<AgentOutput> {
    // 实现小说内容生成
    const aiApi = new AIApi(process.env.VITE_AI_API_KEY!, process.env.VITE_AI_BASE_URL!)
    const content = await aiApi.generateText(prompt, {
      model: 'deepseek-chat',
      maxTokens: 1000
    })

    return {
      success: true,
      result: content,
      suggestions: ['继续发展情节', '添加角色对话', '丰富环境描写']
    }
  }

  private async analyzeMindMap(mindMap: any): Promise<AgentOutput> {
    // 实现思维导图分析
    return {
      success: true,
      result: '思维导图分析完成',
      suggestions: ['建议添加更多细节', '考虑角色关系']
    }
  }
}
```

## 🔧 实用工具和脚本

### 开发脚本
```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "type-check": "vue-tsc --noEmit",
    "timestamp:current": "node docs/tools/timestamp-helper.js current",
    "docs:update": "node docs/tools/timestamp-helper.js update-doc",
    "docs:header": "node docs/tools/timestamp-helper.js header"
  }
}
```

### 代码生成脚本
```bash
#!/bin/bash
# scripts/create-component.sh

COMPONENT_NAME=$1
if [ -z "$COMPONENT_NAME" ]; then
  echo "Usage: ./scripts/create-component.sh ComponentName"
  exit 1
fi

# 创建Vue组件
cat > "src/ui/components/${COMPONENT_NAME}.vue" << EOF
<template>
  <div class="${COMPONENT_NAME,,}">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  // 定义props
}

const props = withDefaults(defineProps<Props>(), {
  // 默认值
})

defineEmits<{
  // 定义事件
}>()
</script>

<style scoped>
.${COMPONENT_NAME,,} {
  /* 样式 */
}
</style>
EOF

# 更新index.ts
echo "export { default as ${COMPONENT_NAME} } from './${COMPONENT_NAME}.vue'" >> src/ui/components/index.ts

echo "✅ 组件 ${COMPONENT_NAME} 创建完成"
```

## 📋 开发检查清单

### 每日开发前
- [ ] 拉取最新代码 `git pull`
- [ ] 检查依赖更新 `npm outdated`
- [ ] 运行测试 `npm run test`
- [ ] 获取当前时间戳 `npm run timestamp:current`

### 功能开发中
- [ ] 编写TypeScript类型定义
- [ ] 实现组件逻辑
- [ ] 添加必要的测试
- [ ] 更新相关文档
- [ ] 检查代码质量 `npm run lint`

### 功能完成后
- [ ] 运行完整测试套件
- [ ] 更新文档时间戳
- [ ] 提交代码并推送
- [ ] 创建Pull Request（如果使用GitHub）

## 🐛 常见问题和解决方案

### 问题1：Vue组件无法识别
```bash
# 解决方案：安装Vue扩展
code --install-extension Vue.volar
```

### 问题2：TypeScript类型错误
```bash
# 解决方案：重新生成类型
npm run type-check
```

### 问题3：依赖冲突
```bash
# 解决方案：清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题4：文档时间戳不同步
```bash
# 解决方案：批量更新文档
find docs -name "*.md" -exec npm run docs:update {} \;
```

## 📚 学习资源

### 官方文档
- [Vue 3 官方文档](https://vuejs.org/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/)
- [Vite 官方文档](https://vitejs.dev/)

### 推荐教程
- Vue 3 Composition API 实战
- TypeScript 进阶指南
- Canvas/SVG 图形编程
- AI API 集成实践

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
