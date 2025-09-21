<template>
    <div class="mindmap-canvas-container" ref="containerRef">
        <!-- 工具栏 -->
        <div class="mindmap-toolbar">
            <div class="toolbar-section">
                <Button variant="ghost" size="sm" @click="handleZoomOut" :disabled="zoom <= minZoom">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                    </svg>
                </Button>

                <span class="zoom-display">{{ Math.round(zoom * 100) }}%</span>

                <Button variant="ghost" size="sm" @click="handleZoomIn" :disabled="zoom >= maxZoom">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </Button>

                <Button variant="ghost" size="sm" @click="handleResetZoom">
                    重置
                </Button>
            </div>

            <div class="toolbar-section">
                <Button variant="ghost" size="sm" @click="toggleGrid" :class="{ 'bg-blue-100': showGrid }">
                    网格
                </Button>

                <Button variant="ghost" size="sm" @click="handleFitToView">
                    适应视图
                </Button>
            </div>
        </div>

        <!-- 画布 -->
        <div class="mindmap-canvas-wrapper">
            <canvas ref="canvasRef" class="mindmap-canvas" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
                @mouseup="handleMouseUp" @wheel="handleWheel" @dblclick="handleDoubleClick" />
        </div>

        <!-- 右键菜单 -->
        <div v-if="contextMenu.visible" class="context-menu"
            :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }">
            <div class="context-menu-item" @click="handleAddNode">
                添加节点
            </div>
            <div class="context-menu-item" @click="handleDeleteNode">
                删除节点
            </div>
            <div class="context-menu-separator" />
            <div class="context-menu-item" @click="handleCopyNode">
                复制
            </div>
            <div class="context-menu-item" @click="handlePasteNode">
                粘贴
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { canvasConfig } from '@/config/app.config'
import { MindMapEngineImpl } from '@/core/mindmap/engine'
import { InteractionManager } from '@/core/mindmap/interaction'
import { CanvasRenderer } from '@/core/mindmap/renderer'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import Button from './Button.vue'

interface Props {
    nodes?: any[]
    connections?: any[]
}

const props = withDefaults(defineProps<Props>(), {
    nodes: () => [],
    connections: () => []
})

const emit = defineEmits<{
    'node-create': [node: any]
    'node-update': [node: any]
    'node-delete': [nodeId: string]
    'node-select': [nodeId: string]
    'canvas-click': [position: { x: number; y: number }]
}>()

// 引用
const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()

// 状态
const zoom = ref(canvasConfig.defaultZoom)
const pan = ref({ x: 0, y: 0 })
const showGrid = ref(true)
const selectedNodes = ref<string[]>([])

// 右键菜单
const contextMenu = ref({
    visible: false,
    x: 0,
    y: 0,
    nodeId: null as string | null
})

// 引擎实例
let engine: MindMapEngineImpl
let renderer: CanvasRenderer
let interactionManager: InteractionManager

const minZoom = canvasConfig.minZoom
const maxZoom = canvasConfig.maxZoom

onMounted(async () => {
    await nextTick()
    initMindMap()
})

onUnmounted(() => {
    cleanup()
})

const initMindMap = () => {
    if (!canvasRef.value) return

    // 初始化引擎
    engine = new MindMapEngineImpl()

    // 初始化渲染器
    const renderConfig = {
        nodeStyle: {
            default: {
                color: '#333',
                backgroundColor: '#fff',
                fontSize: 14,
                fontWeight: 'normal',
                shape: 'rectangle'
            },
            selected: {
                color: '#333',
                backgroundColor: '#e3f2fd',
                borderColor: '#2196f3'
            },
            hovered: {
                color: '#333',
                backgroundColor: '#f5f5f5'
            }
        },
        connectionStyle: {
            default: {
                color: '#666',
                width: 2
            },
            hovered: {
                color: '#007acc',
                width: 3
            }
        },
        grid: {
            enabled: showGrid.value,
            size: canvasConfig.gridSize,
            color: '#e0e0e0'
        },
        background: {
            color: '#ffffff'
        }
    }

    renderer = new CanvasRenderer(canvasRef.value, renderConfig)

    // 初始化交互管理器
    const initialState = {
        zoom: zoom.value,
        pan: pan.value,
        selectedNodes: selectedNodes.value,
        hoveredNode: null,
        isDragging: false,
        isSelecting: false,
        selectionRect: null
    }

    interactionManager = new InteractionManager(canvasRef.value, engine, initialState)

    // 设置事件回调
    interactionManager.setCallbacks({
        onNodeClick: handleNodeClick,
        onNodeDoubleClick: handleNodeDoubleClick,
        onCanvasClick: handleCanvasClick,
        onSelectionChange: handleSelectionChange,
        onZoom: handleZoomChange,
        onPan: handlePanChange
    })

    // 开始渲染循环
    startRenderLoop()

    // 加载初始数据
    loadInitialData()
}

const loadInitialData = () => {
    // 加载传入的节点和连接
    props.nodes.forEach(nodeData => {
        engine.createNode(nodeData.content, nodeData.position, nodeData.parentId)
    })

    props.connections.forEach(connectionData => {
        engine.addConnection(connectionData.from, connectionData.to, connectionData.type)
    })
}

const startRenderLoop = () => {
    const render = () => {
        if (renderer) {
            const nodes = engine.getAllNodes()
            const connections = engine.getAllConnections()
            renderer.render(nodes, connections)
        }
        requestAnimationFrame(render)
    }
    render()
}

const handleMouseDown = (event: MouseEvent) => {
    // 隐藏右键菜单
    contextMenu.value.visible = false
}

const handleMouseMove = (event: MouseEvent) => {
    // 交互管理器会处理鼠标移动
}

const handleMouseUp = (event: MouseEvent) => {
    // 交互管理器会处理鼠标抬起
}

const handleWheel = (event: WheelEvent) => {
    // 交互管理器会处理滚轮事件
}

const handleDoubleClick = (event: MouseEvent) => {
    // 交互管理器会处理双击事件
}

const handleNodeClick = (nodeId: string, event: MouseEvent) => {
    emit('node-select', nodeId)
}

const handleNodeDoubleClick = (nodeId: string, event: MouseEvent) => {
    // 可以在这里实现节点编辑
    console.log('Double click node:', nodeId)
}

const handleCanvasClick = (position: { x: number; y: number }, event: MouseEvent) => {
    emit('canvas-click', position)
}

const handleSelectionChange = (selected: string[]) => {
    selectedNodes.value = selected
}

const handleZoomChange = (newZoom: number) => {
    zoom.value = newZoom
}

const handlePanChange = (newPan: { x: number; y: number }) => {
    pan.value = newPan
}

const handleZoomIn = () => {
    const newZoom = Math.min(zoom.value * 1.2, maxZoom)
    zoom.value = newZoom
    if (renderer) {
        renderer.updateState({ zoom: newZoom })
    }
}

const handleZoomOut = () => {
    const newZoom = Math.max(zoom.value / 1.2, minZoom)
    zoom.value = newZoom
    if (renderer) {
        renderer.updateState({ zoom: newZoom })
    }
}

const handleResetZoom = () => {
    zoom.value = canvasConfig.defaultZoom
    pan.value = { x: 0, y: 0 }
    if (renderer) {
        renderer.updateState({ zoom: zoom.value, pan: pan.value })
    }
}

const toggleGrid = () => {
    showGrid.value = !showGrid.value
    if (renderer) {
        renderer.setConfig({ grid: { enabled: showGrid.value } })
    }
}

const handleFitToView = () => {
    const nodes = engine.getAllNodes()
    if (nodes.length === 0) return

    // 计算所有节点的边界
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity

    nodes.forEach(node => {
        minX = Math.min(minX, node.position.x)
        minY = Math.min(minY, node.position.y)
        maxX = Math.max(maxX, node.position.x)
        maxY = Math.max(maxY, node.position.y)
    })

    // 计算合适的缩放和偏移
    const padding = 100
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2

    zoom.value = canvasConfig.defaultZoom
    pan.value = { x: -centerX, y: -centerY }

    if (renderer) {
        renderer.updateState({ zoom: zoom.value, pan: pan.value })
    }
}

const handleAddNode = () => {
    // 在右键菜单位置添加新节点
    const newNode = engine.createNode('新节点', { x: contextMenu.x, y: contextMenu.y })
    emit('node-create', newNode)
    contextMenu.value.visible = false
}

const handleDeleteNode = () => {
    if (contextMenu.value.nodeId) {
        engine.deleteNode(contextMenu.value.nodeId)
        emit('node-delete', contextMenu.value.nodeId)
    }
    contextMenu.value.visible = false
}

const handleCopyNode = () => {
    // 实现复制功能
    contextMenu.value.visible = false
}

const handlePasteNode = () => {
    // 实现粘贴功能
    contextMenu.value.visible = false
}

const cleanup = () => {
    if (interactionManager) {
        interactionManager.destroy()
    }
}
</script>

<style scoped>
.mindmap-canvas-container {
    @apply relative w-full h-full bg-white;
}

.mindmap-toolbar {
    @apply absolute top-4 left-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2;
}

.toolbar-section {
    @apply flex items-center space-x-1;
}

.zoom-display {
    @apply text-sm font-medium text-gray-700 min-w-[3rem] text-center;
}

.mindmap-canvas-wrapper {
    @apply w-full h-full overflow-hidden;
}

.mindmap-canvas {
    @apply w-full h-full cursor-grab active:cursor-grabbing;
}

.context-menu {
    @apply absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px];
}

.context-menu-item {
    @apply px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer;
}

.context-menu-separator {
    @apply border-t border-gray-200 my-1;
}
</style>
