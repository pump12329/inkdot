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

    // 滚动到节点
    setTimeout(() => {
      const element = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
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

  // 生命周期
  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  return {
    focusedNodeId,
    navigationMode,
    focusNode,
    navigateToNextNode,
    navigateToParent,
    navigateToChild,
    navigateToFirstNode,
    navigateToLastNode
  };
}
