/**
 * 测试数据生成器
 * 用于创建各种测试场景的数据
 */

import type { MindMapNode, MindMapConnection, NodePosition } from '@/types/mindmap';
import type { ChatMessage, ChatResponse } from '@/types/ai';

export class TestDataGenerator {
  /**
   * 生成测试节点
   */
  static generateNodes(
    count: number,
    options: {
      prefix?: string;
      positionRange?: { min: number; max: number };
      contentLength?: { min: number; max: number };
    } = {}
  ): MindMapNode[] {
    const {
      prefix = '测试节点',
      positionRange = { min: 0, max: 1000 },
      contentLength = { min: 5, max: 20 }
    } = options;

    const nodes: MindMapNode[] = [];

    for (let i = 0; i < count; i++) {
      const content = this.generateRandomContent(
        `${prefix} ${i}`,
        contentLength.min,
        contentLength.max
      );

      nodes.push({
        id: `test-node-${i}`,
        content,
        position: this.generateRandomPosition(positionRange),
        createdAt: new Date(Date.now() - Math.random() * 86400000), // 随机过去时间
        updatedAt: new Date(),
        metadata: {
          color: this.generateRandomColor(),
          size: Math.random() > 0.5 ? 'large' : 'normal'
        }
      });
    }

    return nodes;
  }

  /**
   * 生成测试连接
   */
  static generateConnections(
    nodes: MindMapNode[],
    count: number,
    options: {
      connectionTypes?: string[];
      allowSelfConnection?: boolean;
    } = {}
  ): MindMapConnection[] {
    const {
      connectionTypes = ['related', 'parent-child', 'reference'],
      allowSelfConnection = false
    } = options;

    const connections: MindMapConnection[] = [];

    for (let i = 0; i < count; i++) {
      const fromIndex = Math.floor(Math.random() * nodes.length);
      let toIndex = Math.floor(Math.random() * nodes.length);

      // 避免自连接
      if (!allowSelfConnection) {
        while (fromIndex === toIndex) {
          toIndex = Math.floor(Math.random() * nodes.length);
        }
      }

      const type = connectionTypes[Math.floor(Math.random() * connectionTypes.length)];

      connections.push({
        id: `test-connection-${i}`,
        from: nodes[fromIndex].id,
        to: nodes[toIndex].id,
        type,
        createdAt: new Date(),
        metadata: {
          strength: Math.random(),
          bidirectional: Math.random() > 0.5
        }
      });
    }

    return connections;
  }

  /**
   * 生成层次化节点结构
   */
  static generateHierarchicalNodes(depth: number, breadth: number): MindMapNode[] {
    const nodes: MindMapNode[] = [];
    let nodeIndex = 0;

    // 创建根节点
    const rootNode: MindMapNode = {
      id: 'root',
      content: '根节点',
      position: { x: 500, y: 300 },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    nodes.push(rootNode);
    nodeIndex++;

    // 递归创建子节点
    const createChildren = (parentId: string, parentPos: NodePosition, currentDepth: number) => {
      if (currentDepth >= depth) return;

      for (let i = 0; i < breadth; i++) {
        const angle = (i * 2 * Math.PI) / breadth;
        const distance = 150 * (currentDepth + 1);
        const x = parentPos.x + Math.cos(angle) * distance;
        const y = parentPos.y + Math.sin(angle) * distance;

        const childNode: MindMapNode = {
          id: `node-${nodeIndex}`,
          content: `节点 ${currentDepth}-${i}`,
          position: { x, y },
          createdAt: new Date(),
          updatedAt: new Date(),
          metadata: {
            parentId,
            depth: currentDepth,
            index: i
          }
        };

        nodes.push(childNode);
        nodeIndex++;

        // 递归创建下一层
        createChildren(childNode.id, childNode.position, currentDepth + 1);
      }
    };

    createChildren('root', rootNode.position, 0);
    return nodes;
  }

  /**
   * 生成AI聊天测试数据
   */
  static generateChatMessages(count: number): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const userMessages = [
      '请帮我创建一个关于AI的思维导图',
      '如何组织一个项目的思维导图？',
      '请给我一些创意写作的建议',
      '帮我扩展这个节点的内容',
      '这个主题还有什么相关的想法？'
    ];

    const aiMessages = [
      '我来帮您创建一个关于AI的思维导图。首先，我们可以从AI的基础概念开始...',
      '项目思维导图应该包含目标、资源、时间线、风险评估等关键要素...',
      '创意写作可以从角色设定、情节发展、世界观构建等方面入手...',
      '基于您的内容，我建议可以从以下几个角度扩展...',
      '这个主题还可以从历史背景、实际应用、未来发展等维度思考...'
    ];

    for (let i = 0; i < count; i++) {
      const isUser = i % 2 === 0;
      const content = isUser
        ? userMessages[i % userMessages.length]
        : aiMessages[i % aiMessages.length];

      messages.push({
        id: `msg-${i}`,
        role: isUser ? 'user' : 'assistant',
        content,
        timestamp: new Date(Date.now() - (count - i) * 60000), // 按时间顺序
        metadata: {
          model: isUser ? undefined : 'deepseek-chat',
          tokens: Math.floor(Math.random() * 100) + 50
        }
      });
    }

    return messages;
  }

  /**
   * 生成AI响应测试数据
   */
  static generateAIResponse(
    options: {
      success?: boolean;
      content?: string;
      error?: string;
    } = {}
  ): ChatResponse {
    const { success = true, content = '这是一个AI生成的测试响应', error = 'API调用失败' } = options;

    if (success) {
      return {
        id: `response-${Date.now()}`,
        content,
        timestamp: new Date(),
        metadata: {
          model: 'deepseek-chat',
          tokens: Math.floor(Math.random() * 200) + 100,
          finishReason: 'stop'
        }
      };
    } else {
      throw new Error(error);
    }
  }

  /**
   * 生成性能测试数据
   */
  static generatePerformanceTestData(scale: 'small' | 'medium' | 'large' | 'xlarge') {
    const configs = {
      small: { nodes: 10, connections: 5 },
      medium: { nodes: 100, connections: 50 },
      large: { nodes: 1000, connections: 500 },
      xlarge: { nodes: 10000, connections: 5000 }
    };

    const config = configs[scale];
    return {
      nodes: this.generateNodes(config.nodes),
      connections: this.generateConnections(this.generateNodes(config.nodes), config.connections)
    };
  }

  /**
   * 生成随机内容
   */
  private static generateRandomContent(
    prefix: string,
    minLength: number,
    maxLength: number
  ): string {
    const words = ['创新', '设计', '技术', '用户', '体验', '产品', '服务', '价值', '团队', '合作'];
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    const selectedWords = [];

    for (let i = 0; i < length; i++) {
      selectedWords.push(words[Math.floor(Math.random() * words.length)]);
    }

    return `${prefix}: ${selectedWords.join(' ')}`;
  }

  /**
   * 生成随机位置
   */
  private static generateRandomPosition(range: { min: number; max: number }): NodePosition {
    return {
      x: Math.random() * (range.max - range.min) + range.min,
      y: Math.random() * (range.max - range.min) + range.min
    };
  }

  /**
   * 生成随机颜色
   */
  private static generateRandomColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

/**
 * 测试助手函数
 */
export class TestHelpers {
  /**
   * 等待指定时间
   */
  static async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 等待条件满足
   */
  static async waitFor(condition: () => boolean, timeout = 5000): Promise<void> {
    const start = Date.now();

    while (!condition()) {
      if (Date.now() - start > timeout) {
        throw new Error(`等待条件超时: ${timeout}ms`);
      }
      await this.wait(10);
    }
  }

  /**
   * 模拟用户输入
   */
  static simulateUserInput(element: HTMLElement, text: string): void {
    const event = new Event('input', { bubbles: true });
    (element as HTMLInputElement).value = text;
    element.dispatchEvent(event);
  }

  /**
   * 模拟鼠标点击
   */
  static simulateClick(element: HTMLElement): void {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  /**
   * 模拟键盘事件
   */
  static simulateKeyPress(element: HTMLElement, key: string): void {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  }

  /**
   * 创建模拟的Canvas元素
   */
  static createMockCanvas(width = 800, height = 600): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // 模拟getContext方法 - 使用简单的mock对象
    const mockContext = {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Array(4) }),
      putImageData: () => {},
      createImageData: () => ({ data: new Array(4) }),
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {}
    };

    canvas.getContext = () => mockContext as any;

    return canvas;
  }

  /**
   * 创建模拟的Fetch响应
   */
  static createMockFetchResponse(data: any, status = 200): Response {
    return {
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
      headers: new Headers({ 'Content-Type': 'application/json' })
    } as Response;
  }

  /**
   * 测量函数执行时间
   */
  static measureTime<T>(fn: () => T): { result: T; duration: number } {
    const start = performance.now();
    const result = fn();
    const end = performance.now();

    return {
      result,
      duration: end - start
    };
  }
}
