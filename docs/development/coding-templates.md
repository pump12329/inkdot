# InkDot 代码模板

> **文档版本**：v1.0.0  
> **最后更新**：T0.1  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.1

## 📋 概述

本文档提供InkDot项目开发中常用的代码模板，帮助快速创建标准化的代码文件。

## 🎨 Vue 3 组件模板

### 基础组件模板
```vue
<template>
  <div class="component-name" :class="componentClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props定义
interface Props {
  // 定义props类型
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false
})

// Emits定义
const emit = defineEmits<{
  click: [event: MouseEvent]
  change: [value: any]
}>()

// 响应式数据
const isActive = ref(false)

// 计算属性
const componentClasses = computed(() => ({
  [`component-name--${props.variant}`]: true,
  [`component-name--${props.size}`]: true,
  'component-name--disabled': props.disabled,
  'component-name--active': isActive.value
}))

// 方法
function handleClick(event: MouseEvent): void {
  if (props.disabled) return
  emit('click', event)
}

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<style scoped>
.component-name {
  /* 基础样式 */
}

.component-name--primary {
  /* 主要样式 */
}

.component-name--secondary {
  /* 次要样式 */
}

.component-name--disabled {
  /* 禁用样式 */
}
</style>
```

### 思维导图节点组件模板
```vue
<template>
  <div 
    class="mind-map-node" 
    :class="nodeClasses"
    :style="nodeStyles"
    @click="handleClick"
    @dblclick="handleDoubleClick"
  >
    <div class="node-content">
      {{ node.content }}
    </div>
    
    <div v-if="showTools" class="node-tools">
      <button @click="onEdit">编辑</button>
      <button @click="onDelete">删除</button>
    </div>
    
    <div v-if="node.ai?.suggestions?.length" class="ai-suggestions">
      <div 
        v-for="suggestion in node.ai.suggestions" 
        :key="suggestion"
        class="suggestion-item"
        @click="applySuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { MindMapNode } from '@/types'

// Props定义
interface Props {
  node: MindMapNode
  selected?: boolean
  editable?: boolean
  showTools?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  selected: false,
  editable: false,
  showTools: false
})

// Emits定义
const emit = defineEmits<{
  select: [nodeId: string]
  edit: [nodeId: string]
  delete: [nodeId: string]
  update: [nodeId: string, updates: Partial<MindMapNode>]
  applySuggestion: [nodeId: string, suggestion: string]
}>()

// 计算属性
const nodeClasses = computed(() => ({
  'mind-map-node': true,
  'mind-map-node--selected': props.selected,
  'mind-map-node--editable': props.editable,
  [`mind-map-node--${props.node.type}`]: true
}))

const nodeStyles = computed(() => ({
  left: `${props.node.position.x}px`,
  top: `${props.node.position.y}px`,
  ...props.node.style
}))

// 方法
function handleClick(): void {
  emit('select', props.node.id)
}

function handleDoubleClick(): void {
  if (props.editable) {
    emit('edit', props.node.id)
  }
}

function onEdit(): void {
  emit('edit', props.node.id)
}

function onDelete(): void {
  emit('delete', props.node.id)
}

function applySuggestion(suggestion: string): void {
  emit('applySuggestion', props.node.id, suggestion)
}
</script>

<style scoped>
.mind-map-node {
  position: absolute;
  padding: 8px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  min-height: 40px;
}

.mind-map-node:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.mind-map-node--selected {
  border-color: #1976d2;
  background: #e3f2fd;
}

.node-content {
  font-size: 14px;
  line-height: 1.4;
  word-wrap: break-word;
}

.node-tools {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
}

.ai-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:hover {
  background: #f5f5f5;
}
</style>
```

## 🏪 Pinia Store 模板

### 基础Store模板
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFeatureStore = defineStore('feature', () => {
  // 状态
  const items = ref<Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const itemCount = computed(() => items.value.length)
  const hasItems = computed(() => items.value.length > 0)

  // 方法
  async function fetchItems(): Promise<void> {
    loading.value = true
    error.value = null
    
    try {
      // 模拟API调用
      const response = await fetch('/api/items')
      const data = await response.json()
      items.value = data
    } catch (err) {
      error.value = err instanceof Error ? err.message : '未知错误'
    } finally {
      loading.value = false
    }
  }

  function addItem(item: Item): void {
    items.value.push(item)
  }

  function removeItem(id: string): boolean {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      items.value.splice(index, 1)
      return true
    }
    return false
  }

  function updateItem(id: string, updates: Partial<Item>): boolean {
    const item = items.value.find(item => item.id === id)
    if (item) {
      Object.assign(item, updates)
      return true
    }
    return false
  }

  // 重置状态
  function $reset(): void {
    items.value = []
    loading.value = false
    error.value = null
  }

  return {
    // 状态
    items,
    loading,
    error,
    // 计算属性
    itemCount,
    hasItems,
    // 方法
    fetchItems,
    addItem,
    removeItem,
    updateItem,
    $reset
  }
})
```

### 思维导图Store模板
```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MindMapNode, MindMapProject, Connection } from '@/types'

export const useMindMapStore = defineStore('mindMap', () => {
  // 状态
  const currentProject = ref<MindMapProject | null>(null)
  const nodes = ref<MindMapNode[]>([])
  const connections = ref<Connection[]>([])
  const selectedNodeIds = ref<Set<string>>(new Set())
  const editingNodeId = ref<string | null>(null)

  // 计算属性
  const selectedNodes = computed(() => 
    nodes.value.filter(node => selectedNodeIds.value.has(node.id))
  )

  const hasSelection = computed(() => selectedNodeIds.value.size > 0)
  const editingNode = computed(() => 
    editingNodeId.value ? nodes.value.find(n => n.id === editingNodeId.value) : null
  )

  // 节点操作
  function addNode(node: Omit<MindMapNode, 'id' | 'createdAt' | 'updatedAt'>): MindMapNode {
    const newNode: MindMapNode = {
      ...node,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    nodes.value.push(newNode)
    return newNode
  }

  function updateNode(nodeId: string, updates: Partial<MindMapNode>): boolean {
    const index = nodes.value.findIndex(node => node.id === nodeId)
    if (index !== -1) {
      nodes.value[index] = { 
        ...nodes.value[index], 
        ...updates, 
        updatedAt: new Date() 
      }
      return true
    }
    return false
  }

  function deleteNode(nodeId: string): boolean {
    const index = nodes.value.findIndex(node => node.id === nodeId)
    if (index !== -1) {
      nodes.value.splice(index, 1)
      selectedNodeIds.value.delete(nodeId)
      if (editingNodeId.value === nodeId) {
        editingNodeId.value = null
      }
      return true
    }
    return false
  }

  // 选择操作
  function selectNode(nodeId: string): void {
    selectedNodeIds.value.clear()
    selectedNodeIds.value.add(nodeId)
  }

  function toggleNodeSelection(nodeId: string): void {
    if (selectedNodeIds.value.has(nodeId)) {
      selectedNodeIds.value.delete(nodeId)
    } else {
      selectedNodeIds.value.add(nodeId)
    }
  }

  function clearSelection(): void {
    selectedNodeIds.value.clear()
  }

  // 编辑操作
  function startEditing(nodeId: string): void {
    editingNodeId.value = nodeId
  }

  function stopEditing(): void {
    editingNodeId.value = null
  }

  // 连接操作
  function addConnection(fromNodeId: string, toNodeId: string): Connection {
    const connection: Connection = {
      id: generateId(),
      fromNodeId,
      toNodeId,
      createdAt: new Date()
    }
    connections.value.push(connection)
    return connection
  }

  function removeConnection(connectionId: string): boolean {
    const index = connections.value.findIndex(conn => conn.id === connectionId)
    if (index !== -1) {
      connections.value.splice(index, 1)
      return true
    }
    return false
  }

  // 项目操作
  function setCurrentProject(project: MindMapProject): void {
    currentProject.value = project
    nodes.value = project.nodes || []
    connections.value = project.connections || []
    clearSelection()
  }

  function saveProject(): boolean {
    if (!currentProject.value) return false
    
    currentProject.value.nodes = nodes.value
    currentProject.value.connections = connections.value
    currentProject.value.updatedAt = new Date()
    
    // 这里可以调用API保存到服务器
    return true
  }

  return {
    // 状态
    currentProject,
    nodes,
    connections,
    selectedNodeIds,
    editingNodeId,
    // 计算属性
    selectedNodes,
    hasSelection,
    editingNode,
    // 节点操作
    addNode,
    updateNode,
    deleteNode,
    // 选择操作
    selectNode,
    toggleNodeSelection,
    clearSelection,
    // 编辑操作
    startEditing,
    stopEditing,
    // 连接操作
    addConnection,
    removeConnection,
    // 项目操作
    setCurrentProject,
    saveProject
  }
})

// 工具函数
function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
```

## 🔧 工具函数模板

### API客户端模板
```typescript
export class ApiClient {
  private baseURL: string
  private apiKey?: string

  constructor(baseURL: string, apiKey?: string) {
    this.baseURL = baseURL
    this.apiKey = apiKey
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint
    return this.request<T>(url, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}
```

### 工具函数集合模板
```typescript
// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 深拷贝
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any
  if (typeof obj === 'object') {
    const clonedObj = {} as any
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 格式化日期
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
}

// 验证邮箱
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 验证URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
```

## 🧪 测试模板

### Vue组件测试模板
```typescript
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import ComponentName from '@/components/ComponentName.vue'

describe('ComponentName', () => {
  it('renders correctly', () => {
    const wrapper = mount(ComponentName, {
      props: {
        // 测试props
      }
    })
    
    expect(wrapper.exists()).toBe(true)
  })

  it('emits events correctly', async () => {
    const wrapper = mount(ComponentName)
    
    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('handles props correctly', () => {
    const wrapper = mount(ComponentName, {
      props: {
        variant: 'primary',
        size: 'lg'
      }
    })
    
    expect(wrapper.classes()).toContain('component-name--primary')
    expect(wrapper.classes()).toContain('component-name--lg')
  })
})
```

### Store测试模板
```typescript
import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useFeatureStore } from '@/stores/feature'

describe('Feature Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with default state', () => {
    const store = useFeatureStore()
    
    expect(store.items).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('adds item correctly', () => {
    const store = useFeatureStore()
    const item = { id: '1', name: 'Test Item' }
    
    store.addItem(item)
    
    expect(store.items).toContain(item)
    expect(store.itemCount).toBe(1)
  })

  it('removes item correctly', () => {
    const store = useFeatureStore()
    const item = { id: '1', name: 'Test Item' }
    
    store.addItem(item)
    const result = store.removeItem('1')
    
    expect(result).toBe(true)
    expect(store.items).not.toContain(item)
  })
})
```

---

**文档版本**：v1.0.0  
**最后更新**：T0.1  
**状态**：🟢 CURRENT  
**维护者**：InkDot开发团队  
**下次审查**：T30.1
