<template>
    <div id="app" class="min-h-screen bg-gray-50">
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center py-4">
                    <div class="flex items-center">
                        <h1 class="text-xl font-semibold text-gray-900">
                            {{ appConfig.app.title }}
                        </h1>
                        <span class="ml-2 text-sm text-gray-500">
                            v{{ appConfig.app.version }}
                        </span>
                    </div>

                    <nav class="flex space-x-4">
                        <Button variant="ghost" size="sm">新建</Button>
                        <Button variant="ghost" size="sm">打开</Button>
                        <Button variant="ghost" size="sm">保存</Button>
                        <Button variant="ghost" size="sm">导出</Button>
                    </nav>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <!-- 工具栏 -->
            <div class="mb-6 flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <Button variant="primary" @click="showCreateNodeModal = true">
                        添加节点
                    </Button>
                    <Button variant="outline" @click="showSettingsModal = true">
                        设置
                    </Button>
                </div>

                <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">AI助手:</span>
                    <Button :variant="aiEnabled ? 'primary' : 'ghost'" size="sm" @click="toggleAI">
                        {{ aiEnabled ? '已启用' : '启用' }}
                    </Button>
                </div>
            </div>

            <!-- 主内容区域 -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <!-- 侧边栏 -->
                <aside class="lg:col-span-1">
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">节点列表</h3>

                        <div class="space-y-2">
                            <div v-for="node in nodes" :key="node.id"
                                class="p-2 rounded border cursor-pointer hover:bg-gray-50"
                                :class="{ 'bg-blue-50 border-blue-200': selectedNodeId === node.id }"
                                @click="selectNode(node.id)">
                                <div class="text-sm font-medium">{{ node.content }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ new Date(node.createdAt).toLocaleDateString() }}
                                </div>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm" class="w-full mt-4" @click="showCreateNodeModal = true">
                            + 添加节点
                        </Button>
                    </div>
                </aside>

                <!-- 主画布 -->
                <div class="lg:col-span-3">
                    <div class="bg-white rounded-lg shadow-sm h-[600px]">
                        <MindMapCanvas :nodes="nodes" :connections="connections" @node-create="handleNodeCreate"
                            @node-select="handleNodeSelect" @canvas-click="handleCanvasClick" />
                    </div>
                </div>
            </div>
        </main>

        <!-- 创建节点模态框 -->
        <Modal v-model="showCreateNodeModal" title="创建新节点" @close="showCreateNodeModal = false">
            <div class="space-y-4">
                <Input v-model="newNodeContent" label="节点内容" placeholder="请输入节点内容" required />

                <div class="flex justify-end space-x-3">
                    <Button variant="ghost" @click="showCreateNodeModal = false">
                        取消
                    </Button>
                    <Button variant="primary" @click="createNode">
                        创建
                    </Button>
                </div>
            </div>
        </Modal>

        <!-- 设置模态框 -->
        <Modal v-model="showSettingsModal" title="设置" size="lg" @close="showSettingsModal = false">
            <div class="space-y-6">
                <div>
                    <h4 class="text-md font-medium text-gray-900 mb-3">AI设置</h4>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" v-model="aiEnabled"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">启用AI助手</span>
                        </label>
                    </div>
                </div>

                <div>
                    <h4 class="text-md font-medium text-gray-900 mb-3">显示设置</h4>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="checkbox" v-model="showGrid"
                                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span class="ml-2 text-sm text-gray-700">显示网格</span>
                        </label>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <Button variant="ghost" @click="showSettingsModal = false">
                        关闭
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { appConfig } from '@/config/app.config'
import Button from '@/ui/components/Button.vue'
import Input from '@/ui/components/Input.vue'
import MindMapCanvas from '@/ui/components/MindMapCanvas.vue'
import Modal from '@/ui/components/Modal.vue'

// 状态管理
const nodes = ref([
    {
        id: '1',
        content: '中心主题',
        position: { x: 400, y: 300 },
        createdAt: new Date(),
        children: ['2', '3']
    },
    {
        id: '2',
        content: '子主题 1',
        position: { x: 200, y: 200 },
        createdAt: new Date(),
        parent: '1'
    },
    {
        id: '3',
        content: '子主题 2',
        position: { x: 600, y: 200 },
        createdAt: new Date(),
        parent: '1'
    }
])

const connections = ref([
    { id: '1', from: '1', to: '2', type: 'related' },
    { id: '2', from: '1', to: '3', type: 'related' }
])

const selectedNodeId = ref<string | null>(null)
const aiEnabled = ref(appConfig.features.ai)
const showGrid = ref(true)

// 模态框状态
const showCreateNodeModal = ref(false)
const showSettingsModal = ref(false)
const newNodeContent = ref('')

// 方法
const selectNode = (nodeId: string) => {
    selectedNodeId.value = nodeId
}

const handleNodeCreate = (node: any) => {
    nodes.value.push(node)
}

const handleNodeSelect = (nodeId: string) => {
    selectedNodeId.value = nodeId
}

const handleCanvasClick = (position: { x: number; y: number }) => {
    selectedNodeId.value = null
}

const createNode = () => {
    if (!newNodeContent.value.trim()) return

    const newNode = {
        id: Date.now().toString(),
        content: newNodeContent.value,
        position: { x: 400, y: 300 },
        createdAt: new Date()
    }

    nodes.value.push(newNode)
    newNodeContent.value = ''
    showCreateNodeModal.value = false
}

const toggleAI = () => {
    aiEnabled.value = !aiEnabled.value
}
</script>
