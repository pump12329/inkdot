/**
 * 数据管理服务测试
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DataManager } from '@/services/data-manager';
import { StorageServiceFactory } from '@/services/storage';
import { ProjectService } from '@/services/project';
import { FileSystemService } from '@/services/file-system';

describe('数据管理服务', () => {
  let dataManager: DataManager;
  let mockStorage: any;
  let mockProjectService: any;
  let mockFileSystem: any;

  beforeEach(async () => {
    // 创建模拟服务
    mockStorage = {
      init: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      set: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue(null),
      delete: vi.fn().mockResolvedValue(true),
      clear: vi.fn().mockResolvedValue(undefined),
      stats: vi.fn().mockResolvedValue({
        totalItems: 0,
        totalSize: 0,
        availableSpace: 100 * 1024 * 1024
      })
    };

    mockProjectService = {
      init: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue({
        id: 'test-project-id',
        name: 'Test Project',
        createdAt: new Date(),
        updatedAt: new Date(),
        version: '1.0.0',
        metadata: {
          author: 'Test Author',
          tags: [],
          category: 'other',
          language: 'zh-CN',
          statistics: {
            nodeCount: 0,
            connectionCount: 0,
            lastModified: new Date(),
            fileSize: 0,
            wordCount: 0
          }
        },
        settings: {}
      }),
      get: vi.fn().mockResolvedValue(null),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue(true),
      list: vi.fn().mockResolvedValue([]),
      duplicate: vi.fn().mockResolvedValue({}),
      import: vi.fn().mockResolvedValue({}),
      getStatistics: vi.fn().mockResolvedValue({
        nodeCount: 0,
        connectionCount: 0,
        lastModified: new Date(),
        fileSize: 0,
        wordCount: 0
      })
    };

    mockFileSystem = {
      init: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      createFile: vi.fn().mockResolvedValue({
        success: true,
        path: 'test/path',
        data: {}
      }),
      readFile: vi.fn().mockResolvedValue({
        success: true,
        path: 'test/path',
        data: 'test data'
      }),
      updateFile: vi.fn().mockResolvedValue({
        success: true,
        path: 'test/path',
        data: {}
      }),
      deleteFile: vi.fn().mockResolvedValue({
        success: true,
        path: 'test/path'
      }),
      listDirectory: vi.fn().mockResolvedValue({
        path: 'test',
        name: 'test',
        files: [],
        subdirectories: [],
        lastModified: new Date(),
        created: new Date()
      }),
      createDirectory: vi.fn().mockResolvedValue({
        success: true,
        path: 'test/path'
      }),
      getStats: vi.fn().mockResolvedValue({
        totalFiles: 0,
        totalSize: 0,
        totalDirectories: 0,
        availableSpace: 100 * 1024 * 1024
      })
    };

    // 创建数据管理器实例
    dataManager = new DataManager({
      storage: {
        type: 'sqlite',
        prefix: 'test_',
        maxSize: 100 * 1024 * 1024
      },
      projects: {
        autoSave: false, // 禁用自动保存以便测试
        autoSaveInterval: 30000,
        maxProjects: 100
      },
      importExport: {
        supportedFormats: ['json', 'md'],
        maxFileSize: 10 * 1024 * 1024,
        compression: true
      }
    });

    // 注入模拟服务
    (dataManager as any).storage = mockStorage;
    (dataManager as any).projects = mockProjectService;
    (dataManager as any).fileSystem = mockFileSystem;

    await dataManager.init();
  });

  afterEach(async () => {
    if (dataManager) {
      await dataManager.destroy();
    }
  });

  describe('初始化', () => {
    it('应该正确初始化所有服务', async () => {
      expect(mockStorage.init).toHaveBeenCalled();
      expect(mockProjectService.init).toHaveBeenCalled();
      expect(mockFileSystem.init).toHaveBeenCalled();
    });

    it('应该能够获取配置', () => {
      const config = dataManager.getConfig();
      expect(config.storage.type).toBe('sqlite');
      expect(config.storage.maxSize).toBe(100 * 1024 * 1024);
    });

    it('应该能够更新配置', () => {
      dataManager.setConfig({
        storage: {
          type: 'local',
          prefix: 'new_',
          maxSize: 50 * 1024 * 1024
        }
      });

      const config = dataManager.getConfig();
      expect(config.storage.type).toBe('local');
      expect(config.storage.prefix).toBe('new_');
    });
  });

  describe('存储服务代理', () => {
    it('应该能够设置存储项', async () => {
      await dataManager.setStorageItem('test-key', { value: 'test' });
      expect(mockStorage.set).toHaveBeenCalledWith('test-key', { value: 'test' }, undefined);
    });

    it('应该能够获取存储项', async () => {
      mockStorage.get.mockResolvedValue({ value: 'test' });
      const result = await dataManager.getStorageItem('test-key');
      expect(mockStorage.get).toHaveBeenCalledWith('test-key');
      expect(result).toEqual({ value: 'test' });
    });

    it('应该能够删除存储项', async () => {
      const result = await dataManager.deleteStorageItem('test-key');
      expect(mockStorage.delete).toHaveBeenCalledWith('test-key');
      expect(result).toBe(true);
    });

    it('应该能够清空存储', async () => {
      await dataManager.clearStorage();
      expect(mockStorage.clear).toHaveBeenCalled();
    });
  });

  describe('项目管理服务代理', () => {
    it('应该能够创建项目', async () => {
      const project = await dataManager.createProject('Test Project');
      expect(mockProjectService.create).toHaveBeenCalledWith('Test Project', undefined);
      expect(project.id).toBe('test-project-id');
      expect(project.name).toBe('Test Project');
    });

    it('应该能够获取项目', async () => {
      mockProjectService.get.mockResolvedValue({
        id: 'test-id',
        name: 'Test Project'
      });

      const project = await dataManager.getProject('test-id');
      expect(mockProjectService.get).toHaveBeenCalledWith('test-id');
      expect(project.name).toBe('Test Project');
    });

    it('应该能够更新项目', async () => {
      const updates = { name: 'Updated Project' };
      await dataManager.updateProject('test-id', updates);
      expect(mockProjectService.update).toHaveBeenCalledWith('test-id', updates);
    });

    it('应该能够删除项目', async () => {
      const result = await dataManager.deleteProject('test-id');
      expect(mockProjectService.delete).toHaveBeenCalledWith('test-id');
      expect(result).toBe(true);
    });

    it('应该能够列出项目', async () => {
      mockProjectService.list.mockResolvedValue([
        { id: '1', name: 'Project 1' },
        { id: '2', name: 'Project 2' }
      ]);

      const projects = await dataManager.listProjects();
      expect(mockProjectService.list).toHaveBeenCalledWith(undefined);
      expect(projects).toHaveLength(2);
    });

    it('应该能够复制项目', async () => {
      await dataManager.duplicateProject('test-id', 'Copied Project');
      expect(mockProjectService.duplicate).toHaveBeenCalledWith('test-id', 'Copied Project');
    });
  });

  describe('文件系统服务代理', () => {
    it('应该能够创建文件', async () => {
      const result = await dataManager.createFile('test/file.txt', 'content');
      expect(mockFileSystem.createFile).toHaveBeenCalledWith('test/file.txt', 'content', undefined);
      expect(result.success).toBe(true);
    });

    it('应该能够读取文件', async () => {
      const result = await dataManager.readFile('test/file.txt');
      expect(mockFileSystem.readFile).toHaveBeenCalledWith('test/file.txt');
      expect(result.success).toBe(true);
      expect(result.data).toBe('test data');
    });

    it('应该能够更新文件', async () => {
      const result = await dataManager.updateFile('test/file.txt', 'new content');
      expect(mockFileSystem.updateFile).toHaveBeenCalledWith(
        'test/file.txt',
        'new content',
        undefined
      );
      expect(result.success).toBe(true);
    });

    it('应该能够删除文件', async () => {
      const result = await dataManager.deleteFile('test/file.txt');
      expect(mockFileSystem.deleteFile).toHaveBeenCalledWith('test/file.txt');
      expect(result.success).toBe(true);
    });

    it('应该能够列出目录', async () => {
      const result = await dataManager.listDirectory('test');
      expect(mockFileSystem.listDirectory).toHaveBeenCalledWith('test');
      expect(result.path).toBe('test');
    });

    it('应该能够创建目录', async () => {
      const result = await dataManager.createDirectory('test/newdir');
      expect(mockFileSystem.createDirectory).toHaveBeenCalledWith('test/newdir');
      expect(result.success).toBe(true);
    });

    it('应该能够获取文件系统统计', async () => {
      const stats = await dataManager.getFileSystemStats();
      expect(mockFileSystem.getStats).toHaveBeenCalled();
      expect(stats.totalFiles).toBe(0);
    });
  });

  describe('统计信息', () => {
    it('应该能够获取综合统计信息', async () => {
      mockStorage.stats.mockResolvedValue({
        totalItems: 10,
        totalSize: 1024,
        availableSpace: 999 * 1024
      });

      mockProjectService.getStatistics.mockResolvedValue({
        nodeCount: 50,
        connectionCount: 30,
        lastModified: new Date(),
        fileSize: 2048,
        wordCount: 1000
      });

      mockProjectService.list.mockResolvedValue([
        { id: '1', metadata: { archived: false } },
        { id: '2', metadata: { archived: true } }
      ]);

      const stats = await dataManager.getStats();

      expect(stats.storage.totalItems).toBe(10);
      expect(stats.storage.totalSize).toBe(1024);
      expect(stats.projects.totalProjects).toBe(2);
      expect(stats.projects.activeProjects).toBe(1);
      expect(stats.projects.totalNodes).toBe(50);
      expect(stats.projects.totalConnections).toBe(30);
    });
  });

  describe('备份和恢复', () => {
    it('应该能够创建备份', async () => {
      mockProjectService.list.mockResolvedValue([
        {
          id: '1',
          name: 'Project 1',
          metadata: {
            statistics: {
              nodeCount: 10,
              connectionCount: 5
            }
          }
        }
      ]);

      const backup = await dataManager.createBackup();
      expect(backup).toBeInstanceOf(Blob);
      expect(backup.type).toBe('application/json');
    });

    it('应该能够恢复备份', async () => {
      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        projects: [
          {
            id: 'restored-1',
            name: 'Restored Project',
            metadata: { author: 'Test' }
          }
        ]
      };

      const file = new File([JSON.stringify(backupData)], 'backup.json', {
        type: 'application/json'
      });

      const result = await dataManager.restoreBackup(file);
      expect(result.success).toBe(true);
      expect(result.message).toContain('Restored 1 projects');
    });

    it('应该处理无效的备份文件', async () => {
      const file = new File(['invalid json'], 'backup.json', {
        type: 'application/json'
      });

      const result = await dataManager.restoreBackup(file);
      expect(result.success).toBe(false);
      expect(result.message).toContain('Invalid backup file format');
    });
  });

  describe('错误处理', () => {
    it('应该处理存储服务错误', async () => {
      mockStorage.get.mockRejectedValue(new Error('Storage error'));

      const result = await dataManager.getStorageItem('test-key');
      expect(result).toBeNull();
    });

    it('应该处理项目服务错误', async () => {
      mockProjectService.create.mockRejectedValue(new Error('Project creation failed'));

      await expect(dataManager.createProject('Test')).rejects.toThrow('Project creation failed');
    });

    it('应该处理文件系统错误', async () => {
      mockFileSystem.createFile.mockRejectedValue(new Error('File creation failed'));

      await expect(dataManager.createFile('test.txt', 'content')).rejects.toThrow(
        'File creation failed'
      );
    });
  });

  describe('生命周期管理', () => {
    it('应该正确销毁所有服务', async () => {
      await dataManager.destroy();

      expect(mockProjectService.destroy).toHaveBeenCalled();
      expect(mockFileSystem.destroy).toHaveBeenCalled();
      expect(mockStorage.destroy).toHaveBeenCalled();
    });

    it('应该清理自动保存定时器', async () => {
      // 启用自动保存
      dataManager.setConfig({
        projects: {
          autoSave: true,
          autoSaveInterval: 1000,
          maxProjects: 100
        }
      });

      await dataManager.destroy();

      // 验证定时器被清理
      expect((dataManager as any).autoSaveTimer).toBeNull();
    });
  });
});

// 简单的模拟函数创建器
function createMockFunction() {
  const calls: any[] = [];
  const mockFn = (...args: any[]) => {
    calls.push(args);
    return mockFn;
  };

  mockFn.mockResolvedValue = (value: any) => {
    mockFn._resolvedValue = value;
    return mockFn;
  };

  mockFn.mockRejectedValue = (error: Error) => {
    mockFn._rejectedValue = error;
    return mockFn;
  };

  mockFn.mockImplementation = (impl: Function) => {
    mockFn._implementation = impl;
    return mockFn;
  };

  mockFn.toHaveBeenCalled = () => calls.length > 0;
  mockFn.toHaveBeenCalledWith = (...expectedArgs: any[]) => {
    return calls.some(
      call =>
        call.length === expectedArgs.length &&
        call.every((arg: any, index: number) => arg === expectedArgs[index])
    );
  };

  mockFn.calls = calls;
  return mockFn;
}

// 创建 vi 对象
const vi = {
  fn: createMockFunction
};
