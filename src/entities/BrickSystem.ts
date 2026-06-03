import * as PIXI from 'pixi.js'
import { BRICK_HEIGHT, BRICK_WIDTH, firstLevel, GAME_WIDTH, startY } from '../constants'
import { Brick } from './Brick'
import { Ball } from './Ball'
import { collision } from '../utils/collision'

export class BrickSystem extends PIXI.Container {
    private bricks: Brick [] = []
    constructor() {
        super()
        this.draw()
    }
    public checkForCollisions(ball: Ball): boolean {
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            const brick = this.bricks[i]

            if (!collision(brick, ball)) continue

            this.bricks.splice(i, 1)
            this.removeChild(brick)
            brick.destroy()
            return true
        }

        return false
    }

    private draw(): void {
        const cols = firstLevel[0].length

        const totalWidth = cols * BRICK_WIDTH

        const startX = (GAME_WIDTH - totalWidth) / 2
        for (let row = 0; row < firstLevel.length; row++) {
            for (let col = 0; col < firstLevel[row].length; col++) {
                if (firstLevel[row][col] === 0) continue
                const brick = new Brick(PIXI.Texture.from('/assets/brick.png'))

                const x = startX + BRICK_WIDTH * col
                const y = startY + BRICK_HEIGHT * row

                brick.position.set(x, y)
                this.bricks.push(brick)
                this.addChild(brick)
            }
        }
    }
}