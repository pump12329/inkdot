import type { CanvasState, MindMapConnection, MindMapNode, Position, RenderConfig } from '@/types'
import { calculateAngle, calculateDistance } from '@/utils'

/**
 * 画布渲染器
 */
export class CanvasRenderer {
    private canvas: HTMLCanvasElement
    private ctx: CanvasRenderingContext2D
    private config: RenderConfig
    private state: CanvasState

    constructor(canvas: HTMLCanvasElement, config: RenderConfig) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')!
        this.config = config
        this.state = {
            zoom: 1,
            pan: { x: 0, y: 0 },
            selectedNodes: [],
            hoveredNode: null,
            isDragging: false,
            isSelecting: false,
            selectionRect: null
        }

        this.setupCanvas()
    }

    /**
     * 设置画布
     */
    private setupCanvas(): void {
        // 设置高DPI支持
        const dpr = window.devicePixelRatio || 1
        const rect = this.canvas.getBoundingClientRect()

        this.canvas.width = rect.width * dpr
        this.canvas.height = rect.height * dpr

        this.ctx.scale(dpr, dpr)
        this.canvas.style.width = `${rect.width  }px`
        this.canvas.style.height = `${rect.height  }px`
    }

    /**
     * 渲染整个画布
     */
    render(nodes: MindMapNode[], connections: MindMapConnection[]): void {
        this.clear()
        this.renderBackground()
        this.renderGrid()
        this.renderConnections(connections)
        this.renderNodes(nodes)
        this.renderSelectionRect()
    }

    /**
     * 清空画布
     */
    private clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * 渲染背景
     */
    private renderBackground(): void {
        this.ctx.fillStyle = this.config.background.color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }

    /**
     * 渲染网格
     */
    private renderGrid(): void {
        if (!this.config.grid.enabled) return

        this.ctx.strokeStyle = this.config.grid.color
        this.ctx.lineWidth = 1
        this.ctx.setLineDash([])

        const gridSize = this.config.grid.size * this.state.zoom
        const startX = (-this.state.pan.x * this.state.zoom) % gridSize
        const startY = (-this.state.pan.y * this.state.zoom) % gridSize

        // 垂直网格线
        for (let x = startX; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(x, 0)
            this.ctx.lineTo(x, this.canvas.height)
            this.ctx.stroke()
        }

        // 水平网格线
        for (let y = startY; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath()
            this.ctx.moveTo(0, y)
            this.ctx.lineTo(this.canvas.width, y)
            this.ctx.stroke()
        }
    }

    /**
     * 渲染连接线
     */
    private renderConnections(connections: MindMapConnection[]): void {
        for (const connection of connections) {
            this.renderConnection(connection)
        }
    }

    /**
     * 渲染单个连接
     */
    private renderConnection(connection: MindMapConnection): void {
        const fromNode = this.getNodeById(connection.from)
        const toNode = this.getNodeById(connection.to)

        if (!fromNode || !toNode) return

        const fromPos = this.worldToScreen(fromNode.position)
        const toPos = this.worldToScreen(toNode.position)

        // 计算连接点（节点边缘）
        const connectionPoints = this.calculateConnectionPoints(fromPos, toPos, fromNode, toNode)

        this.ctx.strokeStyle = this.config.connectionStyle.default.color
        this.ctx.lineWidth = this.config.connectionStyle.default.width
        this.ctx.setLineDash(this.config.connectionStyle.default.dashArray ?
            this.config.connectionStyle.default.dashArray.split(',').map(Number) : [])

        this.ctx.beginPath()
        this.ctx.moveTo(connectionPoints.from.x, connectionPoints.from.y)
        this.ctx.lineTo(connectionPoints.to.x, connectionPoints.to.y)
        this.ctx.stroke()

        // 渲染箭头
        if (this.config.connectionStyle.default.arrowType !== 'none') {
            this.renderArrow(connectionPoints.from, connectionPoints.to)
        }
    }

    /**
     * 渲染箭头
     */
    private renderArrow(from: Position, to: Position): void {
        const angle = calculateAngle(from, to)
        const arrowLength = 15
        const arrowAngle = Math.PI / 6

        const arrowPoint1 = {
            x: to.x - arrowLength * Math.cos(angle - arrowAngle),
            y: to.y - arrowLength * Math.sin(angle - arrowAngle)
        }

        const arrowPoint2 = {
            x: to.x - arrowLength * Math.cos(angle + arrowAngle),
            y: to.y - arrowLength * Math.sin(angle + arrowAngle)
        }

        this.ctx.beginPath()
        this.ctx.moveTo(to.x, to.y)
        this.ctx.lineTo(arrowPoint1.x, arrowPoint1.y)
        this.ctx.moveTo(to.x, to.y)
        this.ctx.lineTo(arrowPoint2.x, arrowPoint2.y)
        this.ctx.stroke()
    }

    /**
     * 渲染节点
     */
    private renderNodes(nodes: MindMapNode[]): void {
        // 按z-index排序渲染
        const sortedNodes = [...nodes].sort((a, b) => (a.metadata.zIndex || 0) - (b.metadata.zIndex || 0))

        for (const node of sortedNodes) {
            this.renderNode(node)
        }
    }

    /**
     * 渲染单个节点
     */
    private renderNode(node: MindMapNode): void {
        const screenPos = this.worldToScreen(node.position)
        const isSelected = this.state.selectedNodes.includes(node.id)
        const isHovered = this.state.hoveredNode === node.id

        // 选择样式
        let style = this.config.nodeStyle.default
        if (isSelected) {
            style = { ...style, ...this.config.nodeStyle.selected }
        } else if (isHovered) {
            style = { ...style, ...this.config.nodeStyle.hovered }
        }

        // 合并节点自定义样式
        if (node.style) {
            style = { ...style, ...node.style }
        }

        this.renderNodeShape(screenPos, node.content, style, node)
    }

    /**
     * 渲染节点形状
     */
    private renderNodeShape(position: Position, content: string, style: any, node: MindMapNode): void {
        const width = 120
        const height = 60
        const x = position.x - width / 2
        const y = position.y - height / 2

        // 设置样式
        this.ctx.fillStyle = style.backgroundColor || '#fff'
        this.ctx.strokeStyle = style.color || '#333'
        this.ctx.lineWidth = 2
        this.ctx.font = `${style.fontWeight || 'normal'} ${style.fontSize || 14}px Arial`

        // 渲染形状
        this.ctx.beginPath()
        switch (style.shape || 'rectangle') {
            case 'circle':
                this.ctx.arc(position.x, position.y, width / 2, 0, Math.PI * 2)
                break
            case 'diamond':
                this.ctx.moveTo(position.x, y)
                this.ctx.lineTo(x + width, position.y)
                this.ctx.lineTo(position.x, y + height)
                this.ctx.lineTo(x, position.y)
                this.ctx.closePath()
                break
            case 'ellipse':
                this.ctx.ellipse(position.x, position.y, width / 2, height / 2, 0, 0, Math.PI * 2)
                break
            default: // rectangle
                this.ctx.rect(x, y, width, height)
        }

        this.ctx.fill()
        this.ctx.stroke()

        // 渲染文本
        this.ctx.fillStyle = style.color || '#333'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText(content, position.x, position.y)
    }

    /**
     * 渲染选择矩形
     */
    private renderSelectionRect(): void {
        if (!this.state.selectionRect) return

        const rect = this.state.selectionRect
        const width = rect.end.x - rect.start.x
        const height = rect.end.y - rect.start.y

        this.ctx.strokeStyle = '#007acc'
        this.ctx.lineWidth = 1
        this.ctx.setLineDash([5, 5])
        this.ctx.fillStyle = 'rgba(0, 122, 204, 0.1)'

        this.ctx.beginPath()
        this.ctx.rect(rect.start.x, rect.start.y, width, height)
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.setLineDash([])
    }

    /**
     * 世界坐标转屏幕坐标
     */
    private worldToScreen(worldPos: Position): Position {
        return {
            x: (worldPos.x + this.state.pan.x) * this.state.zoom,
            y: (worldPos.y + this.state.pan.y) * this.state.zoom
        }
    }

    /**
     * 屏幕坐标转世界坐标
     */
    private screenToWorld(screenPos: Position): Position {
        return {
            x: screenPos.x / this.state.zoom - this.state.pan.x,
            y: screenPos.y / this.state.zoom - this.state.pan.y
        }
    }

    /**
     * 计算连接点
     */
    private calculateConnectionPoints(
        fromPos: Position,
        toPos: Position,
        fromNode: MindMapNode,
        toNode: MindMapNode
    ): { from: Position; to: Position } {
        // 简化的连接点计算，实际应该考虑节点形状
        const distance = calculateDistance(fromPos, toPos)
        const nodeRadius = 60 // 简化的节点半径

        const fromOffset = nodeRadius / distance
        const toOffset = nodeRadius / distance

        return {
            from: {
                x: fromPos.x + (toPos.x - fromPos.x) * fromOffset,
                y: fromPos.y + (toPos.y - fromPos.y) * fromOffset
            },
            to: {
                x: toPos.x - (toPos.x - fromPos.x) * toOffset,
                y: toPos.y - (toPos.y - fromPos.y) * toOffset
            }
        }
    }

    /**
     * 获取节点（需要从外部传入节点查找函数）
     */
    private getNodeById(id: string): MindMapNode | null {
        // 这个方法需要从外部传入节点查找逻辑
        // 暂时返回null，实际使用时需要传入查找函数
        return null
    }

    /**
     * 更新画布状态
     */
    updateState(newState: Partial<CanvasState>): void {
        Object.assign(this.state, newState)
    }

    /**
     * 获取画布状态
     */
    getState(): CanvasState {
        return { ...this.state }
    }

    /**
     * 设置渲染配置
     */
    setConfig(config: Partial<RenderConfig>): void {
        Object.assign(this.config, config)
    }

    /**
     * 获取渲染配置
     */
    getConfig(): RenderConfig {
        return { ...this.config }
    }

    /**
     * 调整画布大小
     */
    resize(): void {
        this.setupCanvas()
    }
}
