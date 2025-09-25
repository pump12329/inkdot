/**
 * 基础存储服务测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LocalStorageService } from '@/services/storage/local-storage';
import { ProjectService } from '@/services/project/project-service';

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
});

describe('项目管理服务', () => {
  let projectService: ProjectService;

  beforeEach(async () => {
    projectService = new ProjectService();
    await projectService.init();
  });

  it('应该能够创建项目', async () => {
    const project = await projectService.create('Test Project', {
      description: 'A test project',
      metadata: {
        author: 'Test Author',
        tags: ['test', 'demo'],
        category: 'other' as any
      }
    });

    expect(project.id).toBeDefined();
    expect(project.name).toBe('Test Project');
    expect(project.description).toBe('A test project');
    expect(project.metadata.author).toBe('Test Author');
    expect(project.metadata.tags).toContain('test');
  });

  it('应该能够获取项目', async () => {
    const created = await projectService.create('Test Project');
    const retrieved = await projectService.get(created.id);

    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(created.id);
    expect(retrieved?.name).toBe('Test Project');
  });

  it('应该能够更新项目', async () => {
    const project = await projectService.create('Original Name');

    const updated = await projectService.update(project.id, {
      name: 'Updated Name',
      description: 'Updated description'
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.description).toBe('Updated description');
    expect(updated.id).toBe(project.id);
  });

  it('应该能够删除项目', async () => {
    const project = await projectService.create('To Be Deleted');

    const deleted = await projectService.delete(project.id);
    expect(deleted).toBe(true);

    const retrieved = await projectService.get(project.id);
    expect(retrieved).toBeNull();
  });

  it('应该能够列出项目', async () => {
    await projectService.create('Project 1');
    await projectService.create('Project 2');

    const projects = await projectService.list();
    expect(projects.length).toBeGreaterThanOrEqual(2);
  });

  it('应该能够复制项目', async () => {
    const original = await projectService.create('Original Project');

    const duplicate = await projectService.duplicate(original.id, 'Copied Project');

    expect(duplicate.id).not.toBe(original.id);
    expect(duplicate.name).toBe('Copied Project');
    expect(duplicate.createdAt).not.toEqual(original.createdAt);
  });

  it('应该能够搜索项目', async () => {
    await projectService.create('Writing Project', {
      metadata: {
        author: 'Author A',
        tags: ['writing', 'creative'],
        category: 'writing' as any
      }
    });

    await projectService.create('Business Project', {
      metadata: {
        author: 'Author B',
        tags: ['business', 'planning'],
        category: 'business' as any
      }
    });

    const writingProjects = await projectService.search({
      category: 'writing' as any
    });

    expect(writingProjects).toHaveLength(1);
    expect(writingProjects[0].metadata.category).toBe('writing');
  });

  it('应该能够获取项目统计', async () => {
    await projectService.create('Project 1');
    await projectService.create('Project 2');

    const stats = await projectService.getStatistics();

    expect(stats.nodeCount).toBeGreaterThanOrEqual(0);
    expect(stats.connectionCount).toBeGreaterThanOrEqual(0);
    expect(stats.fileSize).toBeGreaterThanOrEqual(0);
  });
});
