/**
 * 简单的事件发射器实现
 */
export class EventEmitter {
    private events: Map<string, Function[]> = new Map()

    /**
     * 监听事件
     */
    on(event: string, listener: Function): this {
        if (!this.events.has(event)) {
            this.events.set(event, [])
        }
        this.events.get(event)!.push(listener)
        return this
    }

    /**
     * 监听一次性事件
     */
    once(event: string, listener: Function): this {
        const onceWrapper = (...args: any[]) => {
            listener(...args)
            this.off(event, onceWrapper)
        }
        return this.on(event, onceWrapper)
    }

    /**
     * 移除事件监听器
     */
    off(event: string, listener?: Function): this {
        if (!this.events.has(event)) {
            return this
        }

        if (!listener) {
            this.events.delete(event)
            return this
        }

        const listeners = this.events.get(event)!
        const index = listeners.indexOf(listener)
        if (index !== -1) {
            listeners.splice(index, 1)
        }

        if (listeners.length === 0) {
            this.events.delete(event)
        }

        return this
    }

    /**
     * 发射事件
     */
    emit(event: string, ...args: any[]): boolean {
        if (!this.events.has(event)) {
            return false
        }

        const listeners = this.events.get(event)!
        for (const listener of listeners) {
            try {
                listener(...args)
            } catch (error) {
                console.error(`Error in event listener for ${event}:`, error)
            }
        }

        return true
    }

    /**
     * 移除所有事件监听器
     */
    removeAllListeners(event?: string): this {
        if (event) {
            this.events.delete(event)
        } else {
            this.events.clear()
        }
        return this
    }

    /**
     * 获取事件监听器数量
     */
    listenerCount(event: string): number {
        if (!this.events.has(event)) {
            return 0
        }
        return this.events.get(event)!.length
    }

    /**
     * 获取所有事件名称
     */
    eventNames(): string[] {
        return Array.from(this.events.keys())
    }
}
