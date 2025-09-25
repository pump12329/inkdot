/**
 * 基础类型定义
 */

// 位置坐标
export interface Position {
  x: number;
  y: number;
}

// 尺寸
export interface Size {
  width: number;
  height: number;
}

// 颜色
export interface Color {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * 思维导图相关类型
 */

// 思维导图节点
export interface MindMapNode {
  id: string;
  content: string;
  position: Position;
  connections: string[];
  style?: NodeStyle;
  metadata?: Record<string, unknown>;
}

// 节点样式
export interface NodeStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  borderRadius?: number;
  padding?: number;
}

// 节点连接
export interface NodeConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  style?: ConnectionStyle;
  label?: string;
}

// 连接样式
export interface ConnectionStyle {
  color?: string;
  width?: number;
  style?: 'solid' | 'dashed' | 'dotted';
  arrowStyle?: 'none' | 'arrow' | 'circle';
}

/**
 * 项目相关类型
 */

// 项目基础信息
export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isTemplate?: boolean;
}

// 完整项目数据
export interface ProjectData extends Project {
  nodes: MindMapNode[];
  connections: NodeConnection[];
  settings?: ProjectSettings;
}

// 项目设置
export interface ProjectSettings {
  canvasSize?: Size;
  defaultNodeStyle?: NodeStyle;
  defaultConnectionStyle?: ConnectionStyle;
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

// 项目元数据
export interface ProjectMetadata {
  version: string;
  lastSavedBy?: string;
  nodeCount: number;
  connectionCount: number;
  exportedAt: Date;
}

/**
 * 用户交互类型
 */

// 鼠标事件类型
export type MouseEventType = 'click' | 'doubleclick' | 'rightclick' | 'drag' | 'drop';

// 键盘事件类型
export type KeyboardEventType = 'keydown' | 'keyup' | 'keypress';

// 画布操作类型
export type CanvasAction =
  | 'select'
  | 'create'
  | 'edit'
  | 'delete'
  | 'connect'
  | 'move'
  | 'zoom'
  | 'pan';

/**
 * 导入导出类型
 */

// 导出格式
export type ExportFormat = 'json' | 'png' | 'svg' | 'pdf' | 'txt' | 'markdown';

// 导入格式
export type ImportFormat = 'json' | 'txt' | 'markdown';

// 导出选项
export interface ExportOptions {
  format: ExportFormat;
  includeMetadata?: boolean;
  compression?: boolean;
  quality?: number; // for image formats
  paperSize?: 'A4' | 'A3' | 'letter' | 'custom'; // for PDF
  customSize?: Size; // for custom paper size
}

// 导入选项
export interface ImportOptions {
  format: ImportFormat;
  mergeWithExisting?: boolean;
  preserveIds?: boolean;
  defaultPosition?: Position;
}

/**
 * 搜索和过滤类型
 */

// 搜索条件
export interface SearchCriteria {
  query: string;
  caseSensitive?: boolean;
  wholeWord?: boolean;
  includeConnections?: boolean;
  tags?: string[];
}

// 搜索结果
export interface SearchResult {
  type: 'node' | 'connection';
  id: string;
  content: string;
  matches: SearchMatch[];
}

// 搜索匹配
export interface SearchMatch {
  start: number;
  end: number;
  text: string;
}

/**
 * 历史和撤销类型
 */

// 操作类型
export type OperationType =
  | 'create_node'
  | 'update_node'
  | 'delete_node'
  | 'create_connection'
  | 'delete_connection'
  | 'move_node'
  | 'batch_operation';

// 历史记录
export interface HistoryEntry {
  id: string;
  type: OperationType;
  timestamp: Date;
  data: Record<string, unknown>;
  description?: string;
}

/**
 * 错误处理类型
 */

// 应用错误
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

// API错误响应
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId?: string;
}

// API成功响应
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  requestId?: string;
}

// API响应联合类型
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 工具函数类型
 */

// 防抖函数类型
export type DebouncedFunction<T extends (...args: never[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

// 事件监听器类型
export type EventListener<T = Event> = (event: T) => void;

// 验证器函数类型
export type Validator<T> = (value: T) => boolean | string;

// 转换器函数类型
export type Transformer<T, U> = (value: T) => U;

/**
 * 组件属性类型
 */

// 按钮变体
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';

// 按钮尺寸
export type ButtonSize = 'small' | 'medium' | 'large';

// 输入框类型
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

// 对话框类型
export type DialogType = 'info' | 'warning' | 'error' | 'confirm';

/**
 * 主题相关类型
 */

// 主题配置
export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      bold: number;
    };
  };
}

// 预设主题
export type PresetTheme = 'light' | 'dark' | 'high-contrast' | 'colorful';

/**
 * 实用工具类型
 */

// 深度只读
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// 深度可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 选择必需的属性
export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;

// 可选的省略
export type OptionalOmit<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

// 非空类型
export type NonNullable<T> = T extends null | undefined ? never : T;

// 数组元素类型
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// 函数返回类型的Promise包装
export type PromiseReturnType<T extends (...args: never[]) => unknown> =
  ReturnType<T> extends Promise<infer U> ? U : ReturnType<T>;
