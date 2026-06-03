import { DisplayObject } from 'pixi.js'

export function collision(a: DisplayObject, b: DisplayObject) {
    const aBounds = a.getBounds()
    const bBounds = b.getBounds()

    return (aBounds.bottom >= bBounds.top
        && aBounds.right >= bBounds.left
        && aBounds.top <= bBounds.bottom
        && aBounds.left <= bBounds.right
    )
}