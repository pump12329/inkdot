/**
 * 思维导图功能示例测试
 * 演示如何使用测试工具和生成器
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestDataGenerator, TestHelpers } from '../utils/test-data-generator';
import { MindMapEngineImpl } from '@/core/mindmap/engine';
import { CanvasRenderer } from '@/core/mindmap/renderer';

describe('思维导图示例测试', () => {
  let engine: MindMapEngineImpl;
  let renderer: CanvasRenderer;
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    // 初始化引擎
    engine = new MindMapEngineImpl();

    // 创建模拟Canvas
    mockCanvas = TestHelpers.createMockCanvas();

    // 初始化渲染器
    renderer = new CanvasRenderer(mockCanvas, {
      nodeStyle: {
        default: {
          color: '#333',
          backgroundColor: '#fff',
          fontSize: 14,
          fontWeight: 'normal',
          shape: 'rectangle'
        }
      },
      connectionStyle: {
        default: {
          color: '#666',
          width: 2
        }
      },
      grid: {
        enabled: true,
        size: 20,
        color: '#e0e0e0'
      },
      background: {
        color: '#ffffff'
      }
    });
  });

  describe('基础节点操作', () => {
    it('应该能够创建和管理节点', () => {
      // 生成测试节点
      const testNodes = TestDataGenerator.generateNodes(5, {
        prefix: '示例节点',
        positionRange: { min: 100, max: 500 }
      });

      // 创建节点
      const createdNodes = testNodes.map(node => engine.createNode(node.content, node.position));

      // 验证节点创建
      expect(createdNodes).toHaveLength(5);
      createdNodes.forEach((node, index) => {
        expect(node.content).toBe(testNodes[index].content);
        expect(node.position).toEqual(testNodes[index].position);
      });

      // 验证引擎状态
      const allNodes = engine.getAllNodes();
      expect(allNodes).toHaveLength(5);
    });

    it('应该能够创建节点连接', () => {
      // 创建两个节点
      const node1 = engine.createNode('父节点', { x: 200, y: 200 });
      const node2 = engine.createNode('子节点', { x: 400, y: 200 });

      // 创建连接
      const connection = engine.addConnection(node1.id, node2.id, 'parent-child');

      // 验证连接
      expect(connection).toBeDefined();
      expect(connection.from).toBe(node1.id);
      expect(connection.to).toBe(node2.id);
      expect(connection.type).toBe('parent-child');

      // 验证引擎状态
      const allConnections = engine.getAllConnections();
      expect(allConnections).toHaveLength(1);
    });
  });

  describe('批量数据操作', () => {
    it('应该能够处理大量节点', () => {
      // 生成大量测试数据
      const { nodes, connections } = TestDataGenerator.generatePerformanceTestData('medium');

      // 创建节点
      const createdNodes = nodes.map(node => engine.createNode(node.content, node.position));

      // 创建连接
      const createdConnections = connections.map(conn =>
        engine.addConnection(conn.from, conn.to, conn.type as any)
      );

      // 验证数据
      expect(createdNodes).toHaveLength(nodes.length);
      expect(createdConnections).toHaveLength(connections.length);

      // 验证引擎状态
      expect(engine.getAllNodes()).toHaveLength(nodes.length);
      expect(engine.getAllConnections()).toHaveLength(connections.length);
    });

    it('应该能够导出和导入数据', () => {
      // 创建测试数据
      const testNodes = TestDataGenerator.generateNodes(3);
      const createdNodes = testNodes.map(node => engine.createNode(node.content, node.position));

      // 创建连接
      engine.addConnection(createdNodes[0].id, createdNodes[1].id, 'related');
      engine.addConnection(createdNodes[1].id, createdNodes[2].id, 'related');

      // 导出数据
      const exported = engine.exportData();
      expect(exported.nodes).toHaveLength(3);
      expect(exported.connections).toHaveLength(2);

      // 创建新引擎并导入数据
      const newEngine = new MindMapEngineImpl();
      newEngine.importData(exported);

      // 验证导入结果
      const importedNodes = newEngine.getAllNodes();
      const importedConnections = newEngine.getAllConnections();

      expect(importedNodes).toHaveLength(3);
      expect(importedConnections).toHaveLength(2);

      // 验证节点内容
      importedNodes.forEach((node, index) => {
        expect(node.content).toBe(testNodes[index].content);
      });
    });
  });

  describe('渲染性能测试', () => {
    it('应该能够快速渲染大量节点', () => {
      // 生成性能测试数据
      const { nodes, connections } = TestDataGenerator.generatePerformanceTestData('large');

      // 创建节点和连接
      nodes.forEach(node => engine.createNode(node.content, node.position));
      connections.forEach(conn => engine.addConnection(conn.from, conn.to, conn.type as any));

      // 测量渲染时间
      const { duration } = TestHelpers.measureTime(() => {
        renderer.render(engine.getAllNodes(), engine.getAllConnections());
      });

      // 验证性能
      expect(duration).toBeLessThan(100); // 应该在100ms内完成
      console.log(
        `渲染${nodes.length}个节点和${connections.length}个连接耗时: ${duration.toFixed(2)}ms`
      );
    });

    it('应该能够处理频繁的渲染更新', async () => {
      // 创建初始节点
      const node = engine.createNode('测试节点', { x: 300, y: 300 });

      // 模拟频繁更新
      const updateCount = 100;
      const updates = [];

      for (let i = 0; i < updateCount; i++) {
        const startTime = performance.now();

        // 更新节点位置
        engine.updateNode(node.id, {
          position: { x: 300 + i, y: 300 + i }
        });

        // 渲染
        renderer.render(engine.getAllNodes(), engine.getAllConnections());

        const endTime = performance.now();
        updates.push(endTime - startTime);
      }

      // 验证性能
      const avgUpdateTime = updates.reduce((sum, time) => sum + time, 0) / updates.length;
      const maxUpdateTime = Math.max(...updates);

      expect(avgUpdateTime).toBeLessThan(10); // 平均更新时间应该小于10ms
      expect(maxUpdateTime).toBeLessThan(50); // 最大更新时间应该小于50ms

      console.log(`平均更新耗时: ${avgUpdateTime.toFixed(2)}ms`);
      console.log(`最大更新耗时: ${maxUpdateTime.toFixed(2)}ms`);
    });
  });

  describe('用户交互模拟', () => {
    it('应该能够模拟用户点击操作', () => {
      // 创建测试节点
      const node = engine.createNode('可点击节点', { x: 300, y: 300 });

      // 模拟点击事件
      const clickHandler = vi.fn();
      engine.on('node-clicked', clickHandler);

      // 模拟用户点击（这里只是演示，实际需要更复杂的交互模拟）
      engine.emit('node-clicked', { nodeId: node.id, position: { x: 300, y: 300 } });

      // 验证事件处理
      expect(clickHandler).toHaveBeenCalledWith({ nodeId: node.id, position: { x: 300, y: 300 } });
    });

    it('应该能够模拟拖拽操作', () => {
      // 创建可拖拽节点
      const node = engine.createNode('可拖拽节点', { x: 300, y: 300 });

      // 模拟拖拽开始
      const dragStartHandler = vi.fn();
      engine.on('drag-start', dragStartHandler);

      engine.emit('drag-start', { nodeId: node.id, position: { x: 300, y: 300 } });

      // 模拟拖拽过程
      const dragMoveHandler = vi.fn();
      engine.on('drag-move', dragMoveHandler);

      engine.emit('drag-move', { nodeId: node.id, position: { x: 350, y: 350 } });

      // 模拟拖拽结束
      const dragEndHandler = vi.fn();
      engine.on('drag-end', dragEndHandler);

      engine.emit('drag-end', { nodeId: node.id, position: { x: 400, y: 400 } });

      // 验证事件处理
      expect(dragStartHandler).toHaveBeenCalledTimes(1);
      expect(dragMoveHandler).toHaveBeenCalledTimes(1);
      expect(dragEndHandler).toHaveBeenCalledTimes(1);

      // 验证节点位置更新
      const updatedNode = engine.getNode(node.id);
      expect(updatedNode?.position).toEqual({ x: 400, y: 400 });
    });
  });

  describe('错误处理测试', () => {
    it('应该能够处理无效的节点操作', () => {
      // 尝试获取不存在的节点
      expect(() => engine.getNode('non-existent-id')).not.toThrow();
      expect(engine.getNode('non-existent-id')).toBeUndefined();

      // 尝试更新不存在的节点
      expect(() => engine.updateNode('non-existent-id', { content: '新内容' })).toThrow();

      // 尝试删除不存在的节点
      expect(() => engine.deleteNode('non-existent-id')).toThrow();
    });

    it('应该能够处理无效的连接操作', () => {
      // 尝试创建无效连接
      expect(() => engine.addConnection('node1', 'node2', 'related')).toThrow();

      // 尝试删除不存在的连接
      expect(() => engine.deleteConnection('non-existent-connection')).toThrow();
    });

    it('应该能够处理渲染错误', () => {
      // 创建无效的渲染器
      const invalidCanvas = document.createElement('canvas');
      const invalidRenderer = new CanvasRenderer(invalidCanvas, {});

      // 验证渲染器能够处理错误情况
      expect(() => {
        invalidRenderer.render([], []);
      }).not.toThrow();
    });
  });

  describe('内存和性能测试', () => {
    it('应该能够处理大量数据而不内存泄漏', () => {
      // 记录初始内存使用
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 创建大量数据
      const { nodes } = TestDataGenerator.generatePerformanceTestData('xlarge');

      nodes.forEach(node => engine.createNode(node.content, node.position));

      // 清理数据
      engine.clear();

      // 强制垃圾回收（如果可用）
      if ((global as any).gc) {
        (global as any).gc();
      }

      // 等待内存清理
      return TestHelpers.wait(100).then(() => {
        const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
        const memoryIncrease = finalMemory - initialMemory;

        // 内存增长应该小于100MB
        expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);

        console.log(`内存使用变化: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
      });
    });
  });
});
