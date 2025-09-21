import type { Position, CanvasState } from '@/types'
import type { MindMapEngine, SelectionRect } from './types'
import { calculateDistance } from '@/utils'

/**
 * 交互管理器
 */
export class InteractionManager {
  private canvas: HTMLCanvasElement
  private engine: MindMapEngine
  private state: CanvasState
  private isMouseDown = false
  private lastMousePos: Position = { x: 0, y: 0 }
  private dragStartPos: Position = { x: 0, y: 0 }
  private isPanning = false
  private isSelecting = false
  private selectionStartPos: Position = { x: 0, y: 0 }

  // 事件回调
  private onNodeClick?: (nodeId: string, event: MouseEvent) => void
  private onNodeDoubleClick?: (nodeId: string, event: MouseEvent) => void
  private onNodeDrag?: (nodeId: string, newPosition: Position) => void
  private onCanvasClick?: (position: Position, event: MouseEvent) => void
  private onSelectionChange?: (selectedNodes: string[]) => void
  private onZoom?: (zoom: number) => void
  private onPan?: (pan: Position) => void

  constructor(canvas: HTMLCanvasElement, engine: MindMapEngine, initialState: CanvasState) {
    this.canvas = canvas
    this.engine = engine
    this.state = initialState

    this.setupEventListeners()
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    // 鼠标事件
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.addEventListener('wheel', this.handleWheel.bind(this))
    this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this))

    // 键盘事件
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))

    // 触摸事件
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this))
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this))
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this))

    // 防止右键菜单
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault())

    // 防止默认的拖拽行为
    this.canvas.addEventListener('dragstart', (e) => e.preventDefault())
  }

  /**
   * 处理鼠标按下事件
   */
  private handleMouseDown(event: MouseEvent): void {
    this.isMouseDown = true
    this.lastMousePos = this.getMousePosition(event)
    this.dragStartPos = { ...this.lastMousePos }

    // 检查是否点击了节点
    const clickedNode = this.getNodeAtPosition(this.lastMousePos)
    
    if (clickedNode) {
      this.handleNodeMouseDown(clickedNode, event)
    } else {
      this.handleCanvasMouseDown(event)
    }
  }

  /**
   * 处理鼠标移动事件
   */
  private handleMouseMove(event: MouseEvent): void {
    const currentPos = this.getMousePosition(event)
    
    if (this.isMouseDown) {
      if (this.isPanning) {
        this.handlePan(currentPos)
      } else if (this.isSelecting) {
        this.handleSelection(currentPos)
      } else {
        // 检查是否在拖拽节点
        const draggedNode = this.getDraggedNode()
        if (draggedNode) {
          this.handleNodeDrag(draggedNode, currentPos)
        } else {
          // 检查是否应该开始平移
          const distance = calculateDistance(this.dragStartPos, currentPos)
          if (distance > 5) {
            this.startPanning()
          }
        }
      }
    } else {
      // 鼠标悬停检测
      this.handleMouseHover(currentPos)
    }

    this.lastMousePos = currentPos
  }

  /**
   * 处理鼠标抬起事件
   */
  private handleMouseUp(event: MouseEvent): void {
    if (!this.isMouseDown) return

    this.isMouseDown = false
    this.isPanning = false

    if (this.isSelecting) {
      this.finishSelection()
      this.isSelecting = false
    }

    // 检查是否有点击事件
    const currentPos = this.getMousePosition(event)
    const distance = calculateDistance(this.dragStartPos, currentPos)
    
    if (distance < 5) {
      this.handleClick(currentPos, event)
    }
  }

  /**
   * 处理双击事件
   */
  private handleDoubleClick(event: MouseEvent): void {
    const pos = this.getMousePosition(event)
    const node = this.getNodeAtPosition(pos)
    
    if (node && this.onNodeDoubleClick) {
      this.onNodeDoubleClick(node.id, event)
    }
  }

  /**
   * 处理滚轮事件
   */
  private handleWheel(event: WheelEvent): void {
    event.preventDefault()
    
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(5, this.state.zoom * zoomFactor))
    
    if (newZoom !== this.state.zoom) {
      this.state.zoom = newZoom
      if (this.onZoom) {
        this.onZoom(newZoom)
      }
    }
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Delete':
      case 'Backspace':
        this.deleteSelectedNodes()
        break
      case 'Escape':
        this.clearSelection()
        break
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          this.selectAllNodes()
        }
        break
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          this.copySelectedNodes()
        }
        break
      case 'v':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          this.pasteNodes()
        }
        break
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    // 处理键盘抬起事件
  }

  /**
   * 处理触摸事件
   */
  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault()
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      this.handleMouseDown(mouseEvent)
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault()
    if (event.touches.length === 1) {
      const touch = event.touches[0]
      const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
      })
      this.handleMouseMove(mouseEvent)
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault()
    const mouseEvent = new MouseEvent('mouseup', {})
    this.handleMouseUp(mouseEvent)
  }

  /**
   * 处理节点鼠标按下
   */
  private handleNodeMouseDown(nodeId: string, event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      // 多选模式
      this.toggleNodeSelection(nodeId)
    } else if (!this.state.selectedNodes.includes(nodeId)) {
      // 单选模式
      this.selectNode(nodeId)
    }
  }

  /**
   * 处理画布鼠标按下
   */
  private handleCanvasMouseDown(event: MouseEvent): void {
    if (event.ctrlKey || event.metaKey) {
      // 开始框选
      this.startSelection()
    } else {
      // 清空选择
      this.clearSelection()
    }
  }

  /**
   * 处理平移
   */
  private handlePan(currentPos: Position): void {
    const deltaX = currentPos.x - this.lastMousePos.x
    const deltaY = currentPos.y - this.lastMousePos.y

    this.state.pan.x += deltaX
    this.state.pan.y += deltaY

    if (this.onPan) {
      this.onPan(this.state.pan)
    }
  }

  /**
   * 开始平移
   */
  private startPanning(): void {
    this.isPanning = true
    this.canvas.style.cursor = 'grabbing'
  }

  /**
   * 处理选择
   */
  private handleSelection(currentPos: Position): void {
    if (!this.state.selectionRect) {
      this.state.selectionRect = {
        start: this.dragStartPos,
        end: currentPos
      }
    } else {
      this.state.selectionRect.end = currentPos
    }
  }

  /**
   * 开始框选
   */
  private startSelection(): void {
    this.isSelecting = true
    this.state.selectionRect = {
      start: this.dragStartPos,
      end: this.dragStartPos
    }
  }

  /**
   * 完成框选
   */
  private finishSelection(): void {
    if (!this.state.selectionRect) return

    const selectedNodes: string[] = []
    const nodes = this.engine.getAllNodes()

    for (const node of nodes) {
      const screenPos = this.worldToScreen(node.position)
      if (this.isPointInSelectionRect(screenPos)) {
        selectedNodes.push(node.id)
      }
    }

    this.state.selectedNodes = selectedNodes
    this.state.selectionRect = null

    if (this.onSelectionChange) {
      this.onSelectionChange(selectedNodes)
    }
  }

  /**
   * 处理节点拖拽
   */
  private handleNodeDrag(nodeId: string, currentPos: Position): void {
    const worldPos = this.screenToWorld(currentPos)
    this.engine.moveNode(nodeId, worldPos)

    if (this.onNodeDrag) {
      this.onNodeDrag(nodeId, worldPos)
    }
  }

  /**
   * 处理鼠标悬停
   */
  private handleMouseHover(currentPos: Position): void {
    const node = this.getNodeAtPosition(currentPos)
    const hoveredNodeId = node ? node.id : null

    if (hoveredNodeId !== this.state.hoveredNode) {
      this.state.hoveredNode = hoveredNodeId
      this.canvas.style.cursor = hoveredNodeId ? 'pointer' : 'default'
    }
  }

  /**
   * 处理点击事件
   */
  private handleClick(position: Position, event: MouseEvent): void {
    const node = this.getNodeAtPosition(position)
    
    if (node && this.onNodeClick) {
      this.onNodeClick(node.id, event)
    } else if (this.onCanvasClick) {
      this.onCanvasClick(position, event)
    }
  }

  /**
   * 获取鼠标位置
   */
  private getMousePosition(event: MouseEvent): Position {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  /**
   * 获取指定位置的节点
   */
  private getNodeAtPosition(position: Position): { id: string } | null {
    const worldPos = this.screenToWorld(position)
    const nodes = this.engine.getAllNodes()

    // 从后往前检查（渲染顺序的反向）
    for (let i = nodes.length - 1; i >= 0; i--) {
      const node = nodes[i]
      const screenPos = this.worldToScreen(node.position)
      const distance = calculateDistance(position, screenPos)
      
      if (distance <= 60) { // 简化的节点半径
        return { id: node.id }
      }
    }

    return null
  }

  /**
   * 获取当前拖拽的节点
   */
  private getDraggedNode(): string | null {
    if (this.state.selectedNodes.length === 1) {
      return this.state.selectedNodes[0]
    }
    return null
  }

  /**
   * 检查点是否在选择矩形内
   */
  private isPointInSelectionRect(point: Position): boolean {
    if (!this.state.selectionRect) return false

    const rect = this.state.selectionRect
    const minX = Math.min(rect.start.x, rect.end.x)
    const maxX = Math.max(rect.start.x, rect.end.x)
    const minY = Math.min(rect.start.y, rect.end.y)
    const maxY = Math.max(rect.start.y, rect.end.y)

    return point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY
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
   * 世界坐标转屏幕坐标
   */
  private worldToScreen(worldPos: Position): Position {
    return {
      x: (worldPos.x + this.state.pan.x) * this.state.zoom,
      y: (worldPos.y + this.state.pan.y) * this.state.zoom
    }
  }

  /**
   * 选择节点
   */
  private selectNode(nodeId: string): void {
    this.state.selectedNodes = [nodeId]
    if (this.onSelectionChange) {
      this.onSelectionChange(this.state.selectedNodes)
    }
  }

  /**
   * 切换节点选择状态
   */
  private toggleNodeSelection(nodeId: string): void {
    const index = this.state.selectedNodes.indexOf(nodeId)
    if (index === -1) {
      this.state.selectedNodes.push(nodeId)
    } else {
      this.state.selectedNodes.splice(index, 1)
    }

    if (this.onSelectionChange) {
      this.onSelectionChange(this.state.selectedNodes)
    }
  }

  /**
   * 清空选择
   */
  private clearSelection(): void {
    this.state.selectedNodes = []
    if (this.onSelectionChange) {
      this.onSelectionChange(this.state.selectedNodes)
    }
  }

  /**
   * 选择所有节点
   */
  private selectAllNodes(): void {
    const nodes = this.engine.getAllNodes()
    this.state.selectedNodes = nodes.map(node => node.id)
    if (this.onSelectionChange) {
      this.onSelectionChange(this.state.selectedNodes)
    }
  }

  /**
   * 删除选中的节点
   */
  private deleteSelectedNodes(): void {
    for (const nodeId of this.state.selectedNodes) {
      this.engine.deleteNode(nodeId)
    }
    this.clearSelection()
  }

  /**
   * 复制选中的节点
   */
  private copySelectedNodes(): void {
    // TODO: 实现复制功能
  }

  /**
   * 粘贴节点
   */
  private pasteNodes(): void {
    // TODO: 实现粘贴功能
  }

  /**
   * 设置事件回调
   */
  setCallbacks(callbacks: {
    onNodeClick?: (nodeId: string, event: MouseEvent) => void
    onNodeDoubleClick?: (nodeId: string, event: MouseEvent) => void
    onNodeDrag?: (nodeId: string, newPosition: Position) => void
    onCanvasClick?: (position: Position, event: MouseEvent) => void
    onSelectionChange?: (selectedNodes: string[]) => void
    onZoom?: (zoom: number) => void
    onPan?: (pan: Position) => void
  }): void {
    Object.assign(this, callbacks)
  }

  /**
   * 获取当前状态
   */
  getState(): CanvasState {
    return { ...this.state }
  }

  /**
   * 更新状态
   */
  updateState(newState: Partial<CanvasState>): void {
    Object.assign(this.state, newState)
  }

  /**
   * 销毁交互管理器
   */
  destroy(): void {
    // 移除所有事件监听器
    this.canvas.removeEventListener('mousedown', this.handleMouseDown.bind(this))
    this.canvas.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    this.canvas.removeEventListener('mouseup', this.handleMouseUp.bind(this))
    this.canvas.removeEventListener('wheel', this.handleWheel.bind(this))
    this.canvas.removeEventListener('dblclick', this.handleDoubleClick.bind(this))
    
    document.removeEventListener('keydown', this.handleKeyDown.bind(this))
    document.removeEventListener('keyup', this.handleKeyUp.bind(this))
    
    this.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this))
    this.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this))
    this.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this))
  }
}
