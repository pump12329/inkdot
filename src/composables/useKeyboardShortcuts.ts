/**
 * 键盘快捷键组合式函数
 */

import { onMounted, onUnmounted } from 'vue';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  handler: (event: KeyboardEvent) => void;
  description?: string;
}

interface KeyboardCallbacks {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onNew?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts(callbacks: KeyboardCallbacks = {}) {
  // 默认快捷键配置
  const shortcuts: KeyboardShortcut[] = [
    // 编辑操作
    {
      key: 'z',
      ctrlKey: true,
      handler: () => callbacks.onUndo?.(),
      description: '撤销'
    },
    {
      key: 'y',
      ctrlKey: true,
      handler: () => callbacks.onRedo?.(),
      description: '重做'
    },
    {
      key: 'z',
      ctrlKey: true,
      shiftKey: true,
      handler: () => callbacks.onRedo?.(),
      description: '重做 (备选)'
    },

    // 文件操作
    {
      key: 's',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onSave?.();
      },
      description: '保存'
    },
    {
      key: 'n',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onNew?.();
      },
      description: '新建'
    },

    // 选择和编辑
    {
      key: 'a',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onSelectAll?.();
      },
      description: '全选'
    },
    {
      key: 'c',
      ctrlKey: true,
      handler: () => callbacks.onCopy?.(),
      description: '复制'
    },
    {
      key: 'v',
      ctrlKey: true,
      handler: () => callbacks.onPaste?.(),
      description: '粘贴'
    },
    {
      key: 'Delete',
      handler: () => callbacks.onDelete?.(),
      description: '删除选中项'
    },
    {
      key: 'Backspace',
      handler: () => callbacks.onDelete?.(),
      description: '删除选中项'
    },

    // 视图操作
    {
      key: '=',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onZoomIn?.();
      },
      description: '放大'
    },
    {
      key: '-',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onZoomOut?.();
      },
      description: '缩小'
    },
    {
      key: '0',
      ctrlKey: true,
      handler: event => {
        event.preventDefault();
        callbacks.onZoomReset?.();
      },
      description: '重置缩放'
    },

    // 取消操作
    {
      key: 'Escape',
      handler: () => callbacks.onEscape?.(),
      description: '取消/清除选择'
    }
  ];

  // 键盘事件处理器
  function handleKeyDown(event: KeyboardEvent): void {
    // 忽略输入框中的按键
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      if (isShortcutMatch(event, shortcut)) {
        shortcut.handler(event);
        break;
      }
    }
  }

  // 检查快捷键是否匹配
  function isShortcutMatch(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
    const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
    const ctrlMatch = !!shortcut.ctrlKey === (event.ctrlKey || event.metaKey);
    const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
    const altMatch = !!shortcut.altKey === event.altKey;

    return keyMatch && ctrlMatch && shiftMatch && altMatch;
  }

  // 获取快捷键描述
  function getShortcutDescription(shortcut: KeyboardShortcut): string {
    const parts: string[] = [];

    if (shortcut.ctrlKey) {
      parts.push(navigator.platform.toLowerCase().includes('mac') ? 'Cmd' : 'Ctrl');
    }
    if (shortcut.shiftKey) {
      parts.push('Shift');
    }
    if (shortcut.altKey) {
      parts.push('Alt');
    }

    parts.push(shortcut.key.toUpperCase());

    return parts.join(' + ');
  }

  // 获取所有快捷键列表
  function getAllShortcuts(): Array<{ keys: string; description: string }> {
    return shortcuts
      .filter(shortcut => shortcut.description)
      .map(shortcut => ({
        keys: getShortcutDescription(shortcut),
        description: shortcut.description || ''
      }));
  }

  // 添加自定义快捷键
  function addShortcut(shortcut: KeyboardShortcut): void {
    shortcuts.push(shortcut);
  }

  // 移除快捷键
  function removeShortcut(
    key: string,
    modifiers: Pick<KeyboardShortcut, 'ctrlKey' | 'shiftKey' | 'altKey'> = {}
  ): void {
    const index = shortcuts.findIndex(
      shortcut =>
        shortcut.key.toLowerCase() === key.toLowerCase() &&
        !!shortcut.ctrlKey === !!modifiers.ctrlKey &&
        !!shortcut.shiftKey === !!modifiers.shiftKey &&
        !!shortcut.altKey === !!modifiers.altKey
    );

    if (index > -1) {
      shortcuts.splice(index, 1);
    }
  }

  // 生命周期钩子
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return {
    getAllShortcuts,
    addShortcut,
    removeShortcut,
    getShortcutDescription
  };
}

// 导出类型
export type { KeyboardCallbacks, KeyboardShortcut };
