import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import { BRICK_HEIGHT, BRICK_WIDTH, GAME_WIDTH, PIECE_SIZE, startY } from '../constants'
import { Brick } from '../entities/Brick'
import { Ball } from '../entities/Ball'
import { collision } from '../utils/collision'

export type BrickHitResult = 'breakable' | 'solid' | null

export class BrickSystem extends PIXI.Container {
    private bricks: Brick[] = []
    private texture = PIXI.Loader.shared.resources.game.textures?.['brick.png']

    public checkForCollisions(ball: Ball): BrickHitResult {
        for (let i = this.bricks.length - 1; i >= 0; i--) {

            const brick = this.bricks[i]

            if (!collision(brick, ball)) continue

            if (!brick.isBreakable) {
                return 'solid'
            }

            PIXI.utils.removeItems(this.bricks, i, 1)

            gsap.to(brick, {
                alpha: 0,
                duration: 0.15,
                onComplete: () => {
                    this.removeChild(brick)
                    brick.destroy()
                }
            })

            this.playDestroyAnimation(brick)
            return 'breakable'
        }

        return null
    }

    public isCleared(): boolean {
        return this.bricks.every((brick) => !brick.isBreakable)
    }

    public loadLevel(level: number[][]): void {
        this.clearBricks()
        this.draw(level)
    }


    private draw(level: number[][]): void {
        const cols = level[0].length
        const totalWidth = cols * BRICK_WIDTH
        const startX = (GAME_WIDTH - totalWidth) / 2

        for (let row = 0; row < level.length; row++) {
            for (let col = 0; col < level[row].length; col++) {
                const cell = level[row][col]
                const isBreakable = cell === 1
                const brick = new Brick(this.texture!, isBreakable)

                const x = startX + BRICK_WIDTH * col
                const y = startY + BRICK_HEIGHT * row

                if (isBreakable) {
                    brick.tint = Math.floor(Math.random() * 0xffffff)
                }

                brick.position.set(x, y)
                this.bricks.push(brick)

                this.addChild(brick)
            }
        }
    }

    private clearBricks(): void {
        for (const brick of this.bricks) {
            this.removeChild(brick)
            brick.destroy()
        }

        this.bricks.length = 0
    }

    private playDestroyAnimation(brick: Brick): void {
        const pieceArr = []
        for (let i = 0; i <= 14; i++) {
            const piece = new PIXI.Sprite(PIXI.Texture.WHITE)

            piece.width = PIECE_SIZE
            piece.height = PIECE_SIZE
            piece.tint = brick.tint

            piece.x = brick.x + Math.random() * (brick.width - PIECE_SIZE)
            piece.y = brick.y + Math.random() * (brick.height - PIECE_SIZE)
            pieceArr.push(piece)
            this.addChild(piece)
            gsap.to(piece, {
                x: piece.x + Math.random() * 40 - 40,
                y: piece.y + Math.random() * 55 - 30,
                rotation: Math.random() * 3 + 3,
                duration: Math.random() * 0.45 + 0.25,
                alpha: 0,
                onComplete: () => {
                    this.removeChild(piece)
                    piece.destroy()
                }

            })
        }


    }
}