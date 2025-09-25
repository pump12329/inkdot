// 项目存储服务
import type {
  InkDotProject,
  ProjectData,
  ProjectMetadata,
  FileOperation,
  ExportOptions
} from '@/types';

export class ProjectStorageService {
  private static readonly STORAGE_KEY = 'inkdot-projects';
  private static readonly CURRENT_PROJECT_KEY = 'inkdot-current-project';
  private static readonly VERSION = '1.0.0';

  // 生成唯一ID
  private static generateId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 创建新项目
  static createProject(name: string, description?: string): InkDotProject {
    const now = new Date();
    return {
      id: this.generateId(),
      name,
      description,
      version: this.VERSION,
      createdAt: now,
      updatedAt: now,
      data: {
        outlineNodes: [],
        selectedNodeId: null,
        editingNodeId: null
      },
      metadata: {
        lastModified: now,
        nodeCount: 0,
        maxLevel: 0
      }
    };
  }

  // 保存项目到本地存储
  static saveProject(project: InkDotProject): FileOperation {
    try {
      const updatedProject = {
        ...project,
        updatedAt: new Date(),
        metadata: {
          ...project.metadata,
          lastModified: new Date(),
          nodeCount: project.data.outlineNodes.length,
          maxLevel: this.calculateMaxLevel(project.data.outlineNodes)
        }
      };

      // 保存到本地存储
      localStorage.setItem(this.CURRENT_PROJECT_KEY, JSON.stringify(updatedProject));

      // 保存到项目列表
      const projects = this.getAllProjects();
      const existingIndex = projects.findIndex(p => p.id === project.id);

      if (existingIndex >= 0) {
        projects[existingIndex] = updatedProject;
      } else {
        projects.push(updatedProject);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));

      return {
        type: 'save',
        status: 'success',
        message: '项目保存成功',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('保存项目失败:', error);
      return {
        type: 'save',
        status: 'error',
        message: `保存失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date()
      };
    }
  }

  // 从本地存储加载项目
  static loadProject(projectId: string): FileOperation & { project?: InkDotProject } {
    try {
      const projects = this.getAllProjects();
      const project = projects.find(p => p.id === projectId);

      if (!project) {
        return {
          type: 'load',
          status: 'error',
          message: '项目不存在',
          timestamp: new Date()
        };
      }

      // 设置为当前项目
      localStorage.setItem(this.CURRENT_PROJECT_KEY, JSON.stringify(project));

      return {
        type: 'load',
        status: 'success',
        message: '项目加载成功',
        timestamp: new Date(),
        project
      };
    } catch (error) {
      console.error('加载项目失败:', error);
      return {
        type: 'load',
        status: 'error',
        message: `加载失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date()
      };
    }
  }

  // 加载当前项目
  static loadCurrentProject(): InkDotProject | null {
    try {
      const currentProjectStr = localStorage.getItem(this.CURRENT_PROJECT_KEY);
      if (!currentProjectStr) return null;

      return JSON.parse(currentProjectStr);
    } catch (error) {
      console.error('加载当前项目失败:', error);
      return null;
    }
  }

  // 获取所有项目列表
  static getAllProjects(): InkDotProject[] {
    try {
      const projectsStr = localStorage.getItem(this.STORAGE_KEY);
      if (!projectsStr) return [];

      return JSON.parse(projectsStr);
    } catch (error) {
      console.error('获取项目列表失败:', error);
      return [];
    }
  }

  // 删除项目
  static deleteProject(projectId: string): FileOperation {
    try {
      const projects = this.getAllProjects();
      const filteredProjects = projects.filter(p => p.id !== projectId);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredProjects));

      // 如果删除的是当前项目，清空当前项目
      const currentProject = this.loadCurrentProject();
      if (currentProject && currentProject.id === projectId) {
        localStorage.removeItem(this.CURRENT_PROJECT_KEY);
      }

      return {
        type: 'save',
        status: 'success',
        message: '项目删除成功',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('删除项目失败:', error);
      return {
        type: 'save',
        status: 'error',
        message: `删除失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date()
      };
    }
  }

  // 导出项目
  static exportProject(
    project: InkDotProject,
    options: ExportOptions
  ): FileOperation & { data?: string } {
    try {
      let data: string;

      switch (options.format) {
        case 'json':
          data = JSON.stringify(project, null, 2);
          break;
        case 'txt':
          data = this.exportAsText(project, options);
          break;
        case 'md':
          data = this.exportAsMarkdown(project, options);
          break;
        default:
          throw new Error(`不支持的导出格式: ${options.format}`);
      }

      return {
        type: 'export',
        status: 'success',
        message: '导出成功',
        timestamp: new Date(),
        data
      };
    } catch (error) {
      console.error('导出项目失败:', error);
      return {
        type: 'export',
        status: 'error',
        message: `导出失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date()
      };
    }
  }

  // 导入项目
  static importProject(
    data: string,
    format: 'json' | 'txt' | 'md'
  ): FileOperation & { project?: InkDotProject } {
    try {
      let project: InkDotProject;

      switch (format) {
        case 'json':
          project = JSON.parse(data);
          break;
        case 'txt':
        case 'md':
          project = this.importFromText(data);
          break;
        default:
          throw new Error(`不支持的导入格式: ${format}`);
      }

      // 验证项目数据
      if (!this.validateProject(project)) {
        throw new Error('项目数据格式无效');
      }

      // 生成新ID避免冲突
      project.id = this.generateId();
      project.createdAt = new Date();
      project.updatedAt = new Date();

      return {
        type: 'import',
        status: 'success',
        message: '导入成功',
        timestamp: new Date(),
        project
      };
    } catch (error) {
      console.error('导入项目失败:', error);
      return {
        type: 'import',
        status: 'error',
        message: `导入失败: ${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date()
      };
    }
  }

  // 导出为文本格式
  private static exportAsText(project: InkDotProject, options: ExportOptions): string {
    let content = `项目: ${project.name}\n`;
    if (project.description) {
      content += `描述: ${project.description}\n`;
    }
    content += `创建时间: ${project.createdAt.toLocaleString()}\n`;
    content += `更新时间: ${project.updatedAt.toLocaleString()}\n\n`;

    if (options.includeMetadata) {
      content += `节点数量: ${project.metadata.nodeCount}\n`;
      content += `最大层级: ${project.metadata.maxLevel}\n\n`;
    }

    content += '大纲内容:\n';
    content += this.formatNodesAsText(project.data.outlineNodes, 0);

    return content;
  }

  // 导出为Markdown格式
  private static exportAsMarkdown(project: InkDotProject, options: ExportOptions): string {
    let content = `# ${project.name}\n\n`;
    if (project.description) {
      content += `${project.description}\n\n`;
    }

    if (options.includeMetadata) {
      content += `## 项目信息\n\n`;
      content += `- 创建时间: ${project.createdAt.toLocaleString()}\n`;
      content += `- 更新时间: ${project.updatedAt.toLocaleString()}\n`;
      content += `- 节点数量: ${project.metadata.nodeCount}\n`;
      content += `- 最大层级: ${project.metadata.maxLevel}\n\n`;
    }

    content += '## 大纲\n\n';
    content += this.formatNodesAsMarkdown(project.data.outlineNodes, 0);

    return content;
  }

  // 格式化节点为文本
  private static formatNodesAsText(nodes: any[], level: number): string {
    let content = '';
    const indent = '  '.repeat(level);

    nodes.forEach(node => {
      content += `${indent}- ${node.content}\n`;
      if (node.children && node.children.length > 0) {
        content += this.formatNodesAsText(node.children, level + 1);
      }
    });

    return content;
  }

  // 格式化节点为Markdown
  private static formatNodesAsMarkdown(nodes: any[], level: number): string {
    let content = '';
    const prefix = '#'.repeat(Math.min(level + 1, 6));

    nodes.forEach(node => {
      content += `${prefix} ${node.content}\n\n`;
      if (node.children && node.children.length > 0) {
        content += this.formatNodesAsMarkdown(node.children, level + 1);
      }
    });

    return content;
  }

  // 从文本导入项目
  private static importFromText(data: string): InkDotProject {
    // 简单的文本解析，实际项目中可能需要更复杂的解析逻辑
    const lines = data.split('\n').filter(line => line.trim());
    const name = lines[0]?.replace(/^#+\s*/, '') || '导入的项目';

    return this.createProject(name, '从文本导入的项目');
  }

  // 验证项目数据
  private static validateProject(project: any): project is InkDotProject {
    return (
      project &&
      typeof project.id === 'string' &&
      typeof project.name === 'string' &&
      typeof project.version === 'string' &&
      project.data &&
      Array.isArray(project.data.outlineNodes)
    );
  }

  // 计算最大层级
  private static calculateMaxLevel(nodes: any[]): number {
    let maxLevel = 0;

    const traverse = (nodeList: any[], level: number) => {
      nodeList.forEach(node => {
        maxLevel = Math.max(maxLevel, level);
        if (node.children && node.children.length > 0) {
          traverse(node.children, level + 1);
        }
      });
    };

    traverse(nodes, 0);
    return maxLevel;
  }
}
