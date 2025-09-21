import { describe, expect, it } from 'vitest'
import { MindMapEngineImpl } from '../src/core/mindmap/engine'
import { deepClone, generateId } from '../src/utils'

describe('MindMap Engine', () => {
    it('should create a node', () => {
        const engine = new MindMapEngineImpl()
        const node = engine.createNode('Test Node', { x: 100, y: 100 })

        expect(node).toBeDefined()
        expect(node.content).toBe('Test Node')
        expect(node.position.x).toBe(100)
        expect(node.position.y).toBe(100)
        expect(node.id).toBeDefined()
    })

    it('should update a node', () => {
        const engine = new MindMapEngineImpl()
        const node = engine.createNode('Test Node', { x: 100, y: 100 })

        const updated = engine.updateNode(node.id, { content: 'Updated Node' })
        expect(updated).toBe(true)

        const updatedNode = engine.getNode(node.id)
        expect(updatedNode?.content).toBe('Updated Node')
    })

    it('should delete a node', () => {
        const engine = new MindMapEngineImpl()
        const node = engine.createNode('Test Node', { x: 100, y: 100 })

        const deleted = engine.deleteNode(node.id)
        expect(deleted).toBe(true)

        const deletedNode = engine.getNode(node.id)
        expect(deletedNode).toBeNull()
    })

    it('should export and import JSON', () => {
        const engine = new MindMapEngineImpl()
        const node1 = engine.createNode('Node 1', { x: 100, y: 100 })
        const node2 = engine.createNode('Node 2', { x: 200, y: 200 })

        const json = engine.exportToJson()
        expect(json).toBeDefined()
        expect(json).toContain('Node 1')
        expect(json).toContain('Node 2')

        const newEngine = new MindMapEngineImpl()
        const imported = newEngine.importFromJson(json)
        expect(imported).toBe(true)

        const nodes = newEngine.getAllNodes()
        expect(nodes).toHaveLength(2)
    })
})

describe('Utils', () => {
    it('should generate unique IDs', () => {
        const id1 = generateId()
        const id2 = generateId()

        expect(id1).toBeDefined()
        expect(id2).toBeDefined()
        expect(id1).not.toBe(id2)
    })

    it('should deep clone objects', () => {
        const original = {
            name: 'test',
            data: { value: 123, nested: { deep: true } }
        }

        const cloned = deepClone(original)
        expect(cloned).toEqual(original)
        expect(cloned).not.toBe(original)
        expect(cloned.data).not.toBe(original.data)
        expect(cloned.data.nested).not.toBe(original.data.nested)
    })
})
