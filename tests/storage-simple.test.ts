/**
 * 简单存储服务测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageService } from '@/services/storage/local-storage';

describe('本地存储服务', () => {
  let storage: LocalStorageService;

  beforeEach(async () => {
    storage = new LocalStorageService({
      prefix: 'test_',
      maxSize: 1024 * 1024 // 1MB
    });
    await storage.init();
  });

  it('应该能够设置和获取数据', async () => {
    const testData = { message: 'Hello World', number: 42 };

    await storage.set('test-key', testData);
    const result = await storage.get('test-key');

    expect(result).toEqual(testData);
  });

  it('应该能够删除数据', async () => {
    await storage.set('test-key', 'test-value');

    const deleted = await storage.delete('test-key');
    expect(deleted).toBe(true);

    const result = await storage.get('test-key');
    expect(result).toBeNull();
  });

  it('应该能够检查数据是否存在', async () => {
    await storage.set('test-key', 'test-value');

    const exists = await storage.exists('test-key');
    expect(exists).toBe(true);

    await storage.delete('test-key');

    const notExists = await storage.exists('test-key');
    expect(notExists).toBe(false);
  });

  it('应该能够批量操作', async () => {
    const items = [
      { key: 'key1', value: 'value1' },
      { key: 'key2', value: 'value2' },
      { key: 'key3', value: 'value3' }
    ];

    await storage.setMany(items);

    const results = await storage.getMany(['key1', 'key2', 'key3']);
    expect(results).toHaveLength(3);
    expect(results[0].value).toBe('value1');
    expect(results[1].value).toBe('value2');
    expect(results[2].value).toBe('value3');

    const deletedCount = await storage.deleteMany(['key1', 'key2']);
    expect(deletedCount).toBe(2);
  });

  it('应该能够查询数据', async () => {
    await storage.set('project1', { name: 'Project 1', category: 'writing' });
    await storage.set('project2', { name: 'Project 2', category: 'business' });
    await storage.set('project3', { name: 'Project 3', category: 'writing' });

    const results = await storage.query({
      keyPattern: 'project*',
      limit: 2
    });

    expect(results).toHaveLength(2);
  });

  it('应该能够获取统计信息', async () => {
    await storage.set('test1', 'data1');
    await storage.set('test2', 'data2');

    const stats = await storage.stats();

    expect(stats.totalItems).toBeGreaterThan(0);
    expect(stats.totalSize).toBeGreaterThan(0);
    expect(typeof stats.availableSpace).toBe('number');
  });

  it('应该能够清空所有数据', async () => {
    await storage.set('key1', 'value1');
    await storage.set('key2', 'value2');

    await storage.clear();

    const result1 = await storage.get('key1');
    const result2 = await storage.get('key2');

    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });

  it('应该能够处理元数据', async () => {
    const metadata = { author: 'Test Author', created: new Date() };

    await storage.set('test-key', 'test-value', metadata);
    const result = await storage.get('test-key');

    expect(result).toBe('test-value');
  });

  it('应该能够处理复杂对象', async () => {
    const complexData = {
      id: 'test-id',
      name: 'Test Object',
      nested: {
        array: [1, 2, 3],
        object: { key: 'value' }
      },
      date: new Date('2023-01-01')
    };

    await storage.set('complex-key', complexData);
    const result = await storage.get('complex-key');

    // JSON序列化会将Date转换为字符串，所以我们需要分别检查
    expect(result.id).toBe('test-id');
    expect(result.name).toBe('Test Object');
    expect(result.nested.array).toEqual([1, 2, 3]);
    expect(result.nested.object.key).toBe('value');
    expect(result.date).toBe('2023-01-01T00:00:00.000Z'); // 序列化后的日期字符串
  });
});
