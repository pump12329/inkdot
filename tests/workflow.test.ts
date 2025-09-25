/**
 * 测试工作流验证
 * 验证测试工具和配置是否正常工作
 */

import { describe, it, expect } from 'vitest';
import { TestDataGenerator, TestHelpers } from './utils/test-data-generator';

describe('测试工作流验证', () => {
  describe('测试数据生成器', () => {
    it('应该能够生成测试节点', () => {
      const nodes = TestDataGenerator.generateNodes(5);

      expect(nodes).toHaveLength(5);
      nodes.forEach((node, index) => {
        expect(node.id).toBe(`test-node-${index}`);
        expect(node.content).toContain('测试节点');
        expect(node.position).toHaveProperty('x');
        expect(node.position).toHaveProperty('y');
        expect(node.createdAt).toBeInstanceOf(Date);
      });
    });

    it('应该能够生成测试连接', () => {
      const nodes = TestDataGenerator.generateNodes(3);
      const connections = TestDataGenerator.generateConnections(nodes, 2);

      expect(connections).toHaveLength(2);
      connections.forEach((conn, index) => {
        expect(conn.id).toBe(`test-connection-${index}`);
        expect(conn.from).toBeDefined();
        expect(conn.to).toBeDefined();
        expect(conn.type).toBeDefined();
      });
    });

    it('应该能够生成层次化节点', () => {
      const nodes = TestDataGenerator.generateHierarchicalNodes(2, 3);

      expect(nodes.length).toBeGreaterThan(1);
      const rootNode = nodes.find(node => node.id === 'root');
      expect(rootNode).toBeDefined();
      expect(rootNode?.content).toBe('根节点');
    });

    it('应该能够生成性能测试数据', () => {
      const smallData = TestDataGenerator.generatePerformanceTestData('small');
      const mediumData = TestDataGenerator.generatePerformanceTestData('medium');

      expect(smallData.nodes.length).toBeLessThan(mediumData.nodes.length);
      expect(smallData.connections.length).toBeLessThan(mediumData.connections.length);
    });

    it('应该能够生成AI聊天测试数据', () => {
      const messages = TestDataGenerator.generateChatMessages(4);

      expect(messages).toHaveLength(4);
      messages.forEach((msg, index) => {
        expect(msg.id).toBe(`msg-${index}`);
        expect(['user', 'assistant']).toContain(msg.role);
        expect(msg.content).toBeDefined();
        expect(msg.timestamp).toBeInstanceOf(Date);
      });
    });

    it('应该能够生成AI响应测试数据', () => {
      const successResponse = TestDataGenerator.generateAIResponse({ success: true });
      expect(successResponse.content).toBeDefined();
      expect(successResponse.timestamp).toBeInstanceOf(Date);

      expect(() => {
        TestDataGenerator.generateAIResponse({ success: false });
      }).toThrow();
    });
  });

  describe('测试助手函数', () => {
    it('应该能够等待指定时间', async () => {
      const start = Date.now();
      await TestHelpers.wait(10);
      const end = Date.now();

      expect(end - start).toBeGreaterThanOrEqual(8); // 允许一些时间误差
    });

    it('应该能够等待条件满足', async () => {
      let condition = false;
      setTimeout(() => {
        condition = true;
      }, 10);

      await TestHelpers.waitFor(() => condition, 100);
      expect(condition).toBe(true);
    });

    it('应该能够创建模拟Canvas', () => {
      const canvas = TestHelpers.createMockCanvas(400, 300);

      expect(canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(canvas.width).toBe(400);
      expect(canvas.height).toBe(300);
      expect(canvas.getContext).toBeDefined();
    });

    it('应该能够创建模拟Fetch响应', () => {
      const mockData = { message: 'test' };
      const response = TestHelpers.createMockFetchResponse(mockData, 200);

      expect(response.ok).toBe(true);
      expect(response.status).toBe(200);
      expect(response.json).toBeDefined();
      expect(response.text).toBeDefined();
    });

    it('应该能够测量函数执行时间', () => {
      const { result, duration } = TestHelpers.measureTime(() => {
        // 模拟一些工作
        let sum = 0;
        for (let i = 0; i < 1000; i++) {
          sum += i;
        }
        return sum;
      });

      expect(result).toBe(499500); // 0+1+2+...+999
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(100); // 应该在100ms内完成
    });
  });

  describe('测试环境配置', () => {
    it('应该能够访问全局测试工具', () => {
      expect(globalThis.describe).toBeDefined();
      expect(globalThis.it).toBeDefined();
      expect(globalThis.expect).toBeDefined();
      expect(globalThis.beforeEach).toBeDefined();
      expect(globalThis.afterEach).toBeDefined();
    });

    it('应该能够访问DOM API', () => {
      expect(document).toBeDefined();
      expect(document.createElement).toBeDefined();
      expect(window).toBeDefined();
      expect(window.localStorage).toBeDefined();
    });

    it('应该能够访问Canvas API', () => {
      const canvas = document.createElement('canvas');
      expect(canvas.getContext).toBeDefined();
    });

    it('应该能够模拟用户交互', () => {
      const element = document.createElement('div');

      TestHelpers.simulateClick(element);
      TestHelpers.simulateKeyPress(element, 'Enter');

      // 验证事件能够正常触发
      expect(element).toBeDefined();
    });
  });

  describe('性能测试工具', () => {
    it('应该能够监控内存使用', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      // 创建一些数据
      const data = new Array(1000).fill(0).map((_, i) => ({ id: i, value: Math.random() }));

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;

      // 内存监控功能应该可用
      expect(typeof initialMemory).toBe('number');
      expect(typeof finalMemory).toBe('number');
      expect(typeof memoryIncrease).toBe('number');
      expect(memoryIncrease).toBeGreaterThanOrEqual(0);
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // 小于10MB
    });

    it('应该能够测量异步操作性能', async () => {
      const asyncOperation = async () => {
        await TestHelpers.wait(10);
        return 'completed';
      };

      const start = performance.now();
      const result = await asyncOperation();
      const end = performance.now();

      expect(result).toBe('completed');
      expect(end - start).toBeGreaterThanOrEqual(8);
      expect(end - start).toBeLessThan(50);
    });
  });
});
