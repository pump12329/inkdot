import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { MindMapNode, NodeConnection } from '@/types';

export function useKeyboardNavigation(
  nodes: MindMapNode[],
  connections: NodeConnection[],
  selectedNodeId: string | null,
  selectNode: (nodeId: string | null) => void
) {
  const focusedNodeId = ref<string | null>(null);
  const navigationMode = ref<'node' | 'canvas'>('canvas');
  const announcementText = ref<string>('');

  // 屏幕阅读器播报
  function announce(text: string): void {
    announcementText.value = text;

    // 使用 ARIA live region
    const liveRegion = document.getElementById('accessibility-live-region');
    if (liveRegion) {
      liveRegion.textContent = text;
    }
  }

  // 获取节点描述信息
  function getNodeDescription(nodeId: string): string {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return '';

    const relations = getNodeRelations.value[nodeId];
    if (!relations) return node.content;

    const parentCount = relations.parents.length;
    const childCount = relations.children.length;
    const siblingCount = relations.siblings.length;

    let description = node.content;

    if (parentCount > 0) {
      description += `，有${parentCount}个父节点`;
    }

    if (childCount > 0) {
      description += `，有${childCount}个子节点`;
    }

    if (siblingCount > 0) {
      description += `，有${siblingCount}个兄弟节点`;
    }

    return description;
  }

  // 计算节点关系
  const getNodeRelations = computed(() => {
    const relations: {
      [nodeId: string]: { parents: string[]; children: string[]; siblings: string[] };
    } = {};

    nodes.forEach(node => {
      relations[node.id] = {
        parents: [],
        children: [],
        siblings: []
      };
    });

    connections.forEach(conn => {
      if (relations[conn.fromNodeId] && relations[conn.toNodeId]) {
        relations[conn.fromNodeId].children.push(conn.toNodeId);
        relations[conn.toNodeId].parents.push(conn.fromNodeId);
      }
    });

    // 计算兄弟节点
    Object.keys(relations).forEach(nodeId => {
      const parents = relations[nodeId].parents;
      if (parents.length > 0) {
        const parentId = parents[0]; // 假设只有一个父节点
        relations[nodeId].siblings = relations[parentId].children.filter(id => id !== nodeId);
      }
    });

    return relations;
  });

  // 获取可导航的节点列表
  const getNavigableNodes = computed(() => {
    return nodes.map(node => node.id);
  });

  // 键盘导航处理
  function handleKeyDown(event: KeyboardEvent): void {
    // 如果正在编辑，不处理导航
    const activeElement = document.activeElement;
    if (activeElement?.tagName === 'INPUT') return;

    const currentNodeId = focusedNodeId.value || selectedNodeId;

    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        navigateToNextNode(event.shiftKey);
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          navigateToParent();
        } else {
          navigateVertically(-1);
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          navigateToChild();
        } else {
          navigateVertically(1);
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          navigateToPreviousSibling();
        } else {
          navigateHorizontally(-1);
        }
        break;

      case 'ArrowRight':
        event.preventDefault();
        if (event.ctrlKey || event.metaKey) {
          navigateToNextSibling();
        } else {
          navigateHorizontally(1);
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        if (currentNodeId) {
          selectNode(currentNodeId);
          focusedNodeId.value = currentNodeId;
          startEditing(currentNodeId);
        }
        break;

      case 'Escape':
        event.preventDefault();
        focusedNodeId.value = null;
        selectNode(null);
        navigationMode.value = 'canvas';
        break;

      case 'Home':
        event.preventDefault();
        navigateToFirstNode();
        break;

      case 'End':
        event.preventDefault();
        navigateToLastNode();
        break;

      case 'f':
      case 'F':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          fitToContent();
        }
        break;
    }
  }

  // 导航功能
  function navigateToNextNode(reverse = false): void {
    const navigableNodes = getNavigableNodes.value;
    if (navigableNodes.length === 0) return;

    const currentIndex = navigableNodes.indexOf(focusedNodeId.value || selectedNodeId || '');
    const nextIndex = reverse
      ? (currentIndex - 1 + navigableNodes.length) % navigableNodes.length
      : (currentIndex + 1) % navigableNodes.length;

    const nextNodeId = navigableNodes[nextIndex];
    focusNode(nextNodeId);
  }

  function navigateToParent(): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const relations = getNodeRelations.value;
    const parents = relations[currentNodeId]?.parents;
    if (parents && parents.length > 0) {
      focusNode(parents[0]);
    }
  }

  function navigateToChild(): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const relations = getNodeRelations.value;
    const children = relations[currentNodeId]?.children;
    if (children && children.length > 0) {
      focusNode(children[0]);
    }
  }

  function navigateToPreviousSibling(): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const relations = getNodeRelations.value;
    const siblings = relations[currentNodeId]?.siblings;
    if (siblings && siblings.length > 0) {
      const currentIndex = siblings.indexOf(currentNodeId);
      const prevIndex = (currentIndex - 1 + siblings.length) % siblings.length;
      focusNode(siblings[prevIndex]);
    }
  }

  function navigateToNextSibling(): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const relations = getNodeRelations.value;
    const siblings = relations[currentNodeId]?.siblings;
    if (siblings && siblings.length > 0) {
      const currentIndex = siblings.indexOf(currentNodeId);
      const nextIndex = (currentIndex + 1) % siblings.length;
      focusNode(siblings[nextIndex]);
    }
  }

  function navigateToFirstNode(): void {
    const navigableNodes = getNavigableNodes.value;
    if (navigableNodes.length > 0) {
      focusNode(navigableNodes[0]);
    }
  }

  function navigateToLastNode(): void {
    const navigableNodes = getNavigableNodes.value;
    if (navigableNodes.length > 0) {
      focusNode(navigableNodes[navigableNodes.length - 1]);
    }
  }

  function navigateVertically(direction: number): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    // 按垂直位置导航
    const sortedNodes = [...nodes].sort((a, b) => {
      if (direction === -1) {
        return a.position.y - b.position.y;
      } else {
        return b.position.y - a.position.y;
      }
    });

    const currentIndex = sortedNodes.findIndex(n => n.id === currentNodeId);
    if (currentIndex !== -1 && currentIndex < sortedNodes.length - 1) {
      focusNode(sortedNodes[currentIndex + 1].id);
    }
  }

  function navigateHorizontally(direction: number): void {
    const currentNodeId = focusedNodeId.value || selectedNodeId;
    if (!currentNodeId) return;

    const currentNode = nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    // 按水平位置导航
    const sortedNodes = [...nodes].sort((a, b) => {
      if (direction === -1) {
        return a.position.x - b.position.x;
      } else {
        return b.position.x - a.position.x;
      }
    });

    const currentIndex = sortedNodes.findIndex(n => n.id === currentNodeId);
    if (currentIndex !== -1 && currentIndex < sortedNodes.length - 1) {
      focusNode(sortedNodes[currentIndex + 1].id);
    }
  }

  // 聚焦节点
  function focusNode(nodeId: string): void {
    focusedNodeId.value = nodeId;
    selectNode(nodeId);
    navigationMode.value = 'node';

    // 屏幕阅读器播报
    const description = getNodeDescription(nodeId);
    announce(`已选中: ${description}`);

    // 滚动到节点
    setTimeout(() => {
      const element = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        (element as HTMLElement).focus();
      }
    }, 100);
  }

  // 开始编辑
  function startEditing(nodeId: string): void {
    const element = document.querySelector(
      `[data-node-id="${nodeId}"] .node-content`
    ) as HTMLElement;
    if (element) {
      element.click();
    }
  }

  // 适应内容
  function fitToContent(): void {
    // 这个函数应该从外部传入
    console.log('Fit to content');
  }

  // 显示键盘快捷键帮助
  function showKeyboardHelp(): void {
    const helpText = [
      '键盘快捷键帮助:',
      'Tab / Shift+Tab: 切换到下一个/上一个节点',
      '方向键: 导航节点',
      'Ctrl+方向键: 在节点关系中导航',
      'Enter / 空格: 选中并编辑节点',
      'Escape: 取消选择',
      'Home: 导航到第一个节点',
      'End: 导航到最后一个节点',
      'Ctrl+F: 适应内容大小'
    ].join('\n');

    announce(helpText);
    console.log(helpText);
  }

  // 生命周期
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);

    // 创建屏幕阅读器的 live region
    const liveRegion = document.createElement('div');
    liveRegion.id = 'accessibility-live-region';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    // 添加帮助快捷键
    const helpShortcut = (event: KeyboardEvent) => {
      if (event.key === 'F1' || (event.ctrlKey && event.key === 'h')) {
        event.preventDefault();
        showKeyboardHelp();
      }
    };

    document.addEventListener('keydown', helpShortcut);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
    const liveRegion = document.getElementById('accessibility-live-region');
    if (liveRegion) {
      liveRegion.remove();
    }
  });

  return {
    focusedNodeId,
    navigationMode,
    announcementText,
    focusNode,
    announce,
    navigateToNextNode,
    navigateToParent,
    navigateToChild,
    navigateToFirstNode,
    navigateToLastNode,
    showKeyboardHelp
  };
}
