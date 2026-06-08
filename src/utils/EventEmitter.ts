type EventHandler = (...args: unknown[]) => void

export class EventEmitter {
    private map = new Map<string, EventHandler[]>()

    public on(eventName: string, handler: EventHandler): void {
        const handlers = this.map.get(eventName) ?? []
        handlers.push(handler)
        this.map.set(eventName, handlers)
    }

    public emit(eventName: string, ...args: unknown[]): void {
        const handlers = this.map.get(eventName)

        if (!handlers) return

        for (const handler of handlers) {
            handler(...args)
        }
    }

    public off(eventName: string, handler: EventHandler): void {
        const handlers = this.map.get(eventName)

        if (!handlers) return

        const newHandlers = handlers.filter((item) => item !== handler)

        if (newHandlers.length === 0) {
            this.map.delete(eventName)
        } else {
            this.map.set(eventName, newHandlers)
        }
    }

    public once(eventName: string, handler: EventHandler): void {
        const wrapper = (...args: unknown[]) => {
            this.off(eventName, wrapper)
            handler(...args)
        }
        this.on(eventName, wrapper)
    }
}