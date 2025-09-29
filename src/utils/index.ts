// MVP简化工具函数

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
