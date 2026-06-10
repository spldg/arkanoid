import { DisplayObject } from 'pixi.js'
import { Ball } from '../entities/Ball'
import { Brick } from '../entities/Brick'

export function collision(a: DisplayObject, b: DisplayObject) {
    const aBounds = a.getBounds()
    const bBounds = b.getBounds()

    return (aBounds.bottom >= bBounds.top
        && aBounds.right >= bBounds.left
        && aBounds.top <= bBounds.bottom
        && aBounds.left <= bBounds.right
    )
}

export function resolveBallBrickCollision(ball: Ball, brick: Brick): void {
    const brickBounds = brick.getBounds()
    const ballBounds = ball.getBounds()

    const overlapLeft = ballBounds.right - brickBounds.left
    const overlapRight = brickBounds.right - ballBounds.left
    const overlapTop = ballBounds.bottom - brickBounds.top
    const overlapBottom = brickBounds.bottom - ballBounds.top

    const overlapX = Math.min(overlapLeft, overlapRight)
    const overlapY = Math.min(overlapTop, overlapBottom)

    if (overlapX < overlapY) {
        if (ball.x < brick.x) {
            ball.x -= overlapX
        } else {
            ball.x += overlapX
        }

        ball.velocityX *= -1
        return
    }

    if (ball.y < brick.y) {
        ball.y -= overlapY
    } else {
        ball.y += overlapY
    }

    ball.velocityY *= -1
}