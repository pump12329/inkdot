# InkDot 编码规范

> **文档版本**：v1.0.0  
> **最后更新**：T0.3  
> **状态**：🟢 CURRENT  
> **维护者**：InkDot开发团队  
> **下次审查**：T30.3

## 📋 概述

本文档定义了InkDot项目的编码规范和最佳实践，确保代码质量、可维护性和团队协作效率。

## 🎯 核心原则

1. **一致性**：保持代码风格的一致性
2. **可读性**：代码应该易于理解和维护
3. **简洁性**：避免过度复杂的设计
4. **安全性**：遵循安全编码实践
5. **性能**：考虑性能影响和优化

## 📝 TypeScript 规范

### 基础配置

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 类型定义

```typescript
// ✅ 好的示例
interface MindMapNode {
  readonly id: string;
  content: string;
  position: Readonly<{ x: number; y: number }>;
  connections: readonly string[];
}

// ❌ 避免的写法
interface BadNode {
  id: any;
  content?: string;
  position: any;
}
```

### 函数定义

```typescript
// ✅ 明确的返回类型
function createNode(data: Partial<MindMapNode>): MindMapNode {
  return {
    id: generateId(),
    content: data.content ?? '',
    position: data.position ?? { x: 0, y: 0 },
    connections: data.connections ?? []
  };
}

// ✅ 异步函数
async function saveProject(project: Project): Promise<SaveResult> {
  try {
    const result = await api.saveProject(project);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🎨 Vue 3 规范

### 组件结构

```vue
<template>
  <div class="mind-map-node" :class="nodeClasses" @click="handleClick">
    <div class="node-content">{{ node.content }}</div>
    <div v-if="showTools" class="node-tools">
      <button @click="onEdit">编辑</button>
      <button @click="onDelete">删除</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { MindMapNode } from '@/types';

// Props定义
interface Props {
  node: MindMapNode;
  editable?: boolean;
  selected?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: false,
  selected: false
});

// Emits定义
const emit = defineEmits<{
  edit: [nodeId: string];
  delete: [nodeId: string];
  select: [nodeId: string];
}>();

// 响应式数据
const showTools = ref(false);

// 计算属性
const nodeClasses = computed(() => ({
  'node--editable': props.editable,
  'node--selected': props.selected
}));

// 方法
function handleClick(): void {
  emit('select', props.node.id);
}

function onEdit(): void {
  emit('edit', props.node.id);
}

function onDelete(): void {
  emit('delete', props.node.id);
}

// 生命周期
onMounted(() => {
  console.log('Node mounted:', props.node.id);
});

onUnmounted(() => {
  console.log('Node unmounted:', props.node.id);
});
</script>

<style scoped>
.mind-map-node {
  position: relative;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mind-map-node:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.node--selected {
  border-color: #1976d2;
  background: #e3f2fd;
}

.node-content {
  font-size: 14px;
  line-height: 1.4;
}

.node-tools {
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
}
</style>
```

### Composables规范

```typescript
// composables/useMindMap.ts
import { ref, computed, readonly } from 'vue';
import type { MindMapNode, MindMapProject } from '@/types';

export function useMindMap() {
  // 私有状态
  const _nodes = ref<MindMapNode[]>([]);
  const _selectedNodeId = ref<string | null>(null);

  // 公共只读状态
  const nodes = readonly(_nodes);
  const selectedNodeId = readonly(_selectedNodeId);

  // 计算属性
  const selectedNode = computed(() => _nodes.value.find(node => node.id === _selectedNodeId.value));

  const nodeCount = computed(() => _nodes.value.length);

  // 方法
  function addNode(node: MindMapNode): void {
    _nodes.value.push(node);
  }

  function removeNode(nodeId: string): boolean {
    const index = _nodes.value.findIndex(node => node.id === nodeId);
    if (index !== -1) {
      _nodes.value.splice(index, 1);
      if (_selectedNodeId.value === nodeId) {
        _selectedNodeId.value = null;
      }
      return true;
    }
    return false;
  }

  function selectNode(nodeId: string | null): void {
    _selectedNodeId.value = nodeId;
  }

  return {
    // 状态
    nodes,
    selectedNodeId,
    selectedNode,
    nodeCount,
    // 方法
    addNode,
    removeNode,
    selectNode
  };
}
```

## 🏪 Pinia Store 规范

```typescript
// stores/mindMapStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MindMapNode, MindMapProject } from '@/types';

export const useMindMapStore = defineStore('mindMap', () => {
  // State
  const currentProject = ref<MindMapProject | null>(null);
  const nodes = ref<MindMapNode[]>([]);
  const selectedNodeIds = ref<Set<string>>(new Set());

  // Getters
  const selectedNodes = computed(() =>
    nodes.value.filter(node => selectedNodeIds.value.has(node.id))
  );

  const hasSelection = computed(() => selectedNodeIds.value.size > 0);

  // Actions
  function setCurrentProject(project: MindMapProject): void {
    currentProject.value = project;
    nodes.value = project.nodes || [];
    selectedNodeIds.value.clear();
  }

  function addNode(node: MindMapNode): void {
    nodes.value.push(node);
    if (currentProject.value) {
      currentProject.value.nodes = nodes.value;
    }
  }

  function updateNode(nodeId: string, updates: Partial<MindMapNode>): void {
    const index = nodes.value.findIndex(node => node.id === nodeId);
    if (index !== -1) {
      nodes.value[index] = { ...nodes.value[index], ...updates };
    }
  }

  function selectNodes(nodeIds: string[]): void {
    selectedNodeIds.value = new Set(nodeIds);
  }

  function toggleNodeSelection(nodeId: string): void {
    if (selectedNodeIds.value.has(nodeId)) {
      selectedNodeIds.value.delete(nodeId);
    } else {
      selectedNodeIds.value.add(nodeId);
    }
  }

  return {
    // State
    currentProject: readonly(currentProject),
    nodes: readonly(nodes),
    selectedNodeIds: readonly(selectedNodeIds),
    // Getters
    selectedNodes,
    hasSelection,
    // Actions
    setCurrentProject,
    addNode,
    updateNode,
    selectNodes,
    toggleNodeSelection
  };
});
```

## 🎨 CSS 规范

### 命名规范

```css
/* BEM命名法 */
.mind-map {
}
.mind-map__canvas {
}
.mind-map__node {
}
.mind-map__node--selected {
}
.mind-map__node--editing {
}

/* 工具类 */
.u-text-center {
  text-align: center;
}
.u-margin-bottom-sm {
  margin-bottom: 8px;
}
.u-hidden {
  display: none;
}
```

### CSS变量

```css
:root {
  /* 颜色系统 */
  --color-primary: #1976d2;
  --color-primary-light: #42a5f5;
  --color-primary-dark: #1565c0;

  --color-secondary: #dc004e;
  --color-success: #2e7d32;
  --color-warning: #ed6c02;
  --color-error: #d32f2f;

  /* 间距系统 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* 字体系统 */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;

  /* 阴影系统 */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.12);
}
```

## 🧪 测试规范

### 单元测试

```typescript
// tests/utils/nodeUtils.test.ts
import { describe, it, expect } from 'vitest';
import { createNode, validateNode } from '@/utils/nodeUtils';

describe('nodeUtils', () => {
  describe('createNode', () => {
    it('应该创建具有默认值的节点', () => {
      const node = createNode({ content: '测试节点' });

      expect(node).toMatchObject({
        content: '测试节点',
        position: { x: 0, y: 0 },
        connections: []
      });
      expect(node.id).toBeDefined();
    });

    it('应该使用提供的值覆盖默认值', () => {
      const customData = {
        content: '自定义节点',
        position: { x: 100, y: 200 }
      };

      const node = createNode(customData);

      expect(node.content).toBe('自定义节点');
      expect(node.position).toEqual({ x: 100, y: 200 });
    });
  });

  describe('validateNode', () => {
    it('应该验证有效的节点', () => {
      const validNode = {
        id: '123',
        content: '有效节点',
        position: { x: 0, y: 0 },
        connections: []
      };

      expect(validateNode(validNode)).toBe(true);
    });

    it('应该拒绝无效的节点', () => {
      const invalidNode = {
        id: '',
        content: '',
        position: null
      };

      expect(validateNode(invalidNode)).toBe(false);
    });
  });
});
```

### 组件测试

```typescript
// tests/components/MindMapNode.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MindMapNode from '@/components/MindMapNode.vue';

describe('MindMapNode', () => {
  const mockNode = {
    id: '1',
    content: '测试节点',
    position: { x: 0, y: 0 },
    connections: []
  };

  it('应该渲染节点内容', () => {
    const wrapper = mount(MindMapNode, {
      props: { node: mockNode }
    });

    expect(wrapper.text()).toContain('测试节点');
  });

  it('应该在点击时发出select事件', async () => {
    const wrapper = mount(MindMapNode, {
      props: { node: mockNode }
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')).toBeTruthy();
    expect(wrapper.emitted('select')?.[0]).toEqual(['1']);
  });

  it('应该在可编辑时显示工具', () => {
    const wrapper = mount(MindMapNode, {
      props: {
        node: mockNode,
        editable: true
      }
    });

    expect(wrapper.find('.node-tools').exists()).toBe(true);
  });
});
```

## 📁 文件和目录规范

### 目录结构

```
src/
├── components/          # 组件
│   ├── ui/             # 基础UI组件
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── index.ts    # 导出文件
│   ├── mindmap/        # 思维导图组件
│   └── workspace/      # 工作区组件
├── composables/        # 组合式函数
├── stores/            # Pinia stores
├── types/             # 类型定义
├── utils/             # 工具函数
├── services/          # API服务
├── assets/            # 静态资源
└── styles/            # 样式文件
```

### 文件命名

- 组件：`PascalCase.vue`
- 工具函数：`camelCase.ts`
- 类型定义：`camelCase.types.ts`
- 测试文件：`*.test.ts`
- 样式文件：`kebab-case.css`

## 🔧 工具配置

### ESLint配置

```json
{
  "extends": ["@vue/eslint-config-typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "vue/no-unused-components": "error"
  }
}
```

## 📋 代码审查清单

### 提交前检查

- [ ] 代码通过ESLint检查
- [ ] 代码通过TypeScript编译
- [ ] 所有测试用例通过
- [ ] 代码覆盖率满足要求
- [ ] 性能影响评估
- [ ] 安全性检查

### 审查要点

- [ ] 代码逻辑正确性
- [ ] 错误处理完整性
- [ ] 性能优化合理性
- [ ] 可维护性和可读性
- [ ] 测试覆盖充分性
- [ ] 文档更新及时性

---

## 📋 文档信息

| 属性       | 值             |
| ---------- | -------------- |
| 文档版本   | v1.0.0         |
| 创建时间戳 | T0             |
| 最后更新   | T0.1           |
| 状态       | 🟢 CURRENT     |
| 维护者     | InkDot开发团队 |
| 审查周期   | T30 (月度)     |
| 下次审查   | T30.1          |

### 📅 版本历史

- **v1.0.0** (T0.1) - 创建编码规范文档，定义TypeScript、Vue 3、测试等规范

### 📝 变更说明

本文档定义InkDot项目的编码规范和最佳实践。随着技术栈更新，规范将相应调整。
