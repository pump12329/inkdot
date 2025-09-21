import type { MindMapConnection, MindMapNode, NodeStyle, Position } from '@/types'
import { deepClone, generateId } from '@/utils'
import { EventEmitter } from '@/utils/event-emitter'
import type { HistoryEntry, HistoryManager, MindMapEngine, NodeEvent } from './types'

/**
 * 思维导图引擎实现
 */
export class MindMapEngineImpl extends EventEmitter implements MindMapEngine {
    private nodes: Map<string, MindMapNode> = new Map()
    private connections: Map<string, MindMapConnection> = new Map()
    private history: HistoryManager
    private eventQueue: NodeEvent[] = []

    constructor(historyManager?: HistoryManager) {
        super()
        this.history = historyManager || new SimpleHistoryManager()
    }

    /**
     * 创建新节点
     */
    createNode(content: string, position: Position, parentId?: string): MindMapNode {
        const nodeId = generateId()
        const now = new Date()

        const node: MindMapNode = {
            id: nodeId,
            content,
            position,
            children: [],
            parent: parentId,
            metadata: {},
            style: this.getDefaultNodeStyle(),
            createdAt: now,
            updatedAt: now
        }

        this.nodes.set(nodeId, node)

        // 如果有父节点，添加到父节点的子节点列表
        if (parentId) {
            const parent = this.nodes.get(parentId)
            if (parent) {
                parent.children.push(nodeId)
                parent.updatedAt = now
            }
        }

        // 记录历史
        this.history.push('create_node', { nodeId, content, position, parentId }, `创建节点: ${content}`)

        // 触发事件
        this.emitNodeEvent('create', nodeId, { node })

        return node
    }

    /**
     * 更新节点
     */
    updateNode(nodeId: string, updates: Partial<MindMapNode>): boolean {
        const node = this.nodes.get(nodeId)
        if (!node) return false

        const oldNode = deepClone(node)
        const now = new Date()

        // 更新节点属性
        Object.assign(node, updates, { updatedAt: now })

        // 如果更新了位置，需要更新连接
        if (updates.position && !this.isEqualPosition(oldNode.position, updates.position)) {
            this.updateConnectionsForNode(nodeId)
        }

        // 记录历史
        this.history.push('update_node', { nodeId, updates, oldNode }, `更新节点: ${node.content}`)

        // 触发事件
        this.emitNodeEvent('update', nodeId, { node, oldNode, updates })

        return true
    }

    /**
     * 删除节点
     */
    deleteNode(nodeId: string): boolean {
        const node = this.nodes.get(nodeId)
        if (!node) return false

        // 删除所有子节点
        for (const childId of node.children) {
            this.deleteNode(childId)
        }

        // 从父节点中移除
        if (node.parent) {
            const parent = this.nodes.get(node.parent)
            if (parent) {
                parent.children = parent.children.filter(id => id !== nodeId)
                parent.updatedAt = new Date()
            }
        }

        // 删除相关连接
        this.removeConnectionsForNode(nodeId)

        // 记录历史
        this.history.push('delete_node', { nodeId, node: deepClone(node) }, `删除节点: ${node.content}`)

        // 删除节点
        this.nodes.delete(nodeId)

        // 触发事件
        this.emitNodeEvent('delete', nodeId, { node })

        return true
    }

    /**
     * 移动节点
     */
    moveNode(nodeId: string, newPosition: Position): boolean {
        const node = this.nodes.get(nodeId)
        if (!node) return false

        const oldPosition = { ...node.position }
        node.position = newPosition
        node.updatedAt = new Date()

        // 更新相关连接
        this.updateConnectionsForNode(nodeId)

        // 记录历史
        this.history.push('move_node', { nodeId, oldPosition, newPosition }, `移动节点: ${node.content}`)

        // 触发事件
        this.emitNodeEvent('move', nodeId, { node, oldPosition, newPosition })

        return true
    }

    /**
     * 添加连接
     */
    addConnection(fromId: string, toId: string, type = 'related'): MindMapConnection | null {
        if (fromId === toId) return null

        const fromNode = this.nodes.get(fromId)
        const toNode = this.nodes.get(toId)
        if (!fromNode || !toNode) return null

        // 检查是否已存在连接
        const existingConnection = Array.from(this.connections.values()).find(
            conn => conn.from === fromId && conn.to === toId
        )
        if (existingConnection) return existingConnection

        const connectionId = generateId()
        const connection: MindMapConnection = {
            id: connectionId,
            from: fromId,
            to: toId,
            type: type as any
        }

        this.connections.set(connectionId, connection)

        // 记录历史
        this.history.push('add_connection', { connectionId, fromId, toId, type }, `添加连接: ${fromNode.content} -> ${toNode.content}`)

        return connection
    }

    /**
     * 移除连接
     */
    removeConnection(connectionId: string): boolean {
        const connection = this.connections.get(connectionId)
        if (!connection) return false

        // 记录历史
        this.history.push('remove_connection', { connectionId, connection: deepClone(connection) }, `移除连接`)

        this.connections.delete(connectionId)
        return true
    }

    /**
     * 获取节点
     */
    getNode(nodeId: string): MindMapNode | null {
        return this.nodes.get(nodeId) || null
    }

    /**
     * 获取子节点
     */
    getChildren(nodeId: string): MindMapNode[] {
        const node = this.nodes.get(nodeId)
        if (!node) return []

        return node.children.map(childId => this.nodes.get(childId)!).filter(Boolean)
    }

    /**
     * 获取父节点
     */
    getParent(nodeId: string): MindMapNode | null {
        const node = this.nodes.get(nodeId)
        if (!node || !node.parent) return null

        return this.nodes.get(node.parent) || null
    }

    /**
     * 获取所有节点
     */
    getAllNodes(): MindMapNode[] {
        return Array.from(this.nodes.values())
    }

    /**
     * 获取所有连接
     */
    getAllConnections(): MindMapConnection[] {
        return Array.from(this.connections.values())
    }

    /**
     * 导出为JSON
     */
    exportToJson(): string {
        const data = {
            nodes: Array.from(this.nodes.values()),
            connections: Array.from(this.connections.values()),
            exportedAt: new Date().toISOString()
        }
        return JSON.stringify(data, null, 2)
    }

    /**
     * 从JSON导入
     */
    importFromJson(json: string): boolean {
        try {
            const data = JSON.parse(json)

            if (!data.nodes || !Array.isArray(data.nodes)) {
                throw new Error('Invalid JSON format: missing nodes array')
            }

            // 清空当前数据
            this.clear()

            // 导入节点
            for (const nodeData of data.nodes) {
                const node: MindMapNode = {
                    ...nodeData,
                    createdAt: new Date(nodeData.createdAt),
                    updatedAt: new Date(nodeData.updatedAt)
                }
                this.nodes.set(node.id, node)
            }

            // 导入连接
            if (data.connections && Array.isArray(data.connections)) {
                for (const connectionData of data.connections) {
                    this.connections.set(connectionData.id, connectionData)
                }
            }

            // 记录历史
            this.history.push('import', { json }, '导入思维导图数据')

            return true
        } catch (error) {
            console.error('Failed to import JSON:', error)
            return false
        }
    }

    /**
     * 清空所有数据
     */
    clear(): void {
        this.nodes.clear()
        this.connections.clear()
        this.eventQueue = []

        // 记录历史
        this.history.push('clear', {}, '清空思维导图')
    }

    /**
     * 获取默认节点样式
     */
    private getDefaultNodeStyle(): NodeStyle {
        return {
            color: '#333',
            backgroundColor: '#fff',
            fontSize: 14,
            fontWeight: 'normal',
            shape: 'rectangle'
        }
    }

    /**
     * 检查两个位置是否相等
     */
    private isEqualPosition(pos1: Position, pos2: Position): boolean {
        return pos1.x === pos2.x && pos1.y === pos2.y
    }

    /**
     * 更新节点的连接
     */
    private updateConnectionsForNode(nodeId: string): void {
        // 这里可以添加连接更新的逻辑
        // 例如重新计算连接路径等
    }

    /**
     * 移除节点的所有连接
     */
    private removeConnectionsForNode(nodeId: string): void {
        const connectionsToRemove: string[] = []

        for (const [connectionId, connection] of this.connections) {
            if (connection.from === nodeId || connection.to === nodeId) {
                connectionsToRemove.push(connectionId)
            }
        }

        for (const connectionId of connectionsToRemove) {
            this.connections.delete(connectionId)
        }
    }

    /**
     * 触发节点事件
     */
    private emitNodeEvent(type: NodeEvent['type'], nodeId: string, data?: any): void {
        const event: NodeEvent = {
            type,
            nodeId,
            data,
            timestamp: new Date()
        }

        this.eventQueue.push(event)
        this.emit('nodeEvent', event)
    }
}

/**
 * 简单历史管理器实现
 */
class SimpleHistoryManager implements HistoryManager {
    private history: HistoryEntry[] = []
    private currentIndex = -1
    private maxSize = 100

    canUndo(): boolean {
        return this.currentIndex >= 0
    }

    canRedo(): boolean {
        return this.currentIndex < this.history.length - 1
    }

    undo(): boolean {
        if (!this.canUndo()) return false
        this.currentIndex--
        return true
    }

    redo(): boolean {
        if (!this.canRedo()) return false
        this.currentIndex++
        return true
    }

    push(action: string, data: any, description: string): void {
        // 如果当前位置不在末尾，删除后续历史
        this.history = this.history.slice(0, this.currentIndex + 1)

        const entry: HistoryEntry = {
            id: generateId(),
            action,
            data,
            timestamp: new Date(),
            description
        }

        this.history.push(entry)
        this.currentIndex++

        // 限制历史记录大小
        if (this.history.length > this.maxSize) {
            this.history.shift()
            this.currentIndex--
        }
    }

    clear(): void {
        this.history = []
        this.currentIndex = -1
    }

    getHistory(): HistoryEntry[] {
        return [...this.history]
    }
}
