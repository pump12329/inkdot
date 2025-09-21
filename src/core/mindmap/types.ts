import type { MindMapConnection, MindMapNode, NodeStyle, Position } from '@/types'

// 思维导图引擎特定类型
export interface MindMapEngine {
    createNode(content: string, position: Position, parentId?: string): MindMapNode
    updateNode(nodeId: string, updates: Partial<MindMapNode>): boolean
    deleteNode(nodeId: string): boolean
    moveNode(nodeId: string, newPosition: Position): boolean
    addConnection(fromId: string, toId: string, type?: string): MindMapConnection | null
    removeConnection(connectionId: string): boolean
    getNode(nodeId: string): MindMapNode | null
    getChildren(nodeId: string): MindMapNode[]
    getParent(nodeId: string): MindMapNode | null
    getAllNodes(): MindMapNode[]
    getAllConnections(): MindMapConnection[]
    exportToJson(): string
    importFromJson(json: string): boolean
    clear(): void
}

// 节点操作事件
export interface NodeEvent {
    type: 'create' | 'update' | 'delete' | 'move' | 'select' | 'deselect'
    nodeId: string
    data?: any
    timestamp: Date
}

// 画布状态
export interface CanvasState {
    zoom: number
    pan: Position
    selectedNodes: string[]
    hoveredNode: string | null
    isDragging: boolean
    isSelecting: boolean
    selectionRect: SelectionRect | null
}

export interface SelectionRect {
    start: Position
    end: Position
}

// 渲染配置
export interface RenderConfig {
    nodeStyle: {
        default: NodeStyle
        selected: NodeStyle
        hovered: NodeStyle
    }
    connectionStyle: {
        default: {
            color: string
            width: number
            dashArray?: string
        }
        hovered: {
            color: string
            width: number
        }
    }
    grid: {
        enabled: boolean
        size: number
        color: string
    }
    background: {
        color: string
        pattern?: string
    }
}

// 布局算法接口
export interface LayoutAlgorithm {
    name: string
    calculate(nodes: MindMapNode[], connections: MindMapConnection[]): Position[]
}

// 搜索和过滤
export interface SearchFilter {
    query: string
    tags?: string[]
    dateRange?: {
        start: Date
        end: Date
    }
    metadata?: Record<string, any>
}

export interface SearchResult {
    nodeId: string
    score: number
    matches: {
        field: string
        value: string
        highlighted: string
    }[]
}

// 历史记录
export interface HistoryEntry {
    id: string
    action: string
    data: any
    timestamp: Date
    description: string
}

export interface HistoryManager {
    canUndo(): boolean
    canRedo(): boolean
    undo(): boolean
    redo(): boolean
    push(action: string, data: any, description: string): void
    clear(): void
    getHistory(): HistoryEntry[]
}
