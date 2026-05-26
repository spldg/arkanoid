import * as PIXI from 'pixi.js'
import { GameField } from './GameField'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'
import { Platform } from './entities/Platform'
import { Ball } from './entities/Ball'
export class GameScene extends PIXI.Container {
    private gamefield = new GameField()
    private platform = new Platform()
    private ball = new Ball()
    constructor() {
        super()

        this.addChild(
            this.gamefield,
            this.platform,
            this.ball
        )
    }
    public update() {
        this.platform.update()
        this.ball.update()

        // temporary collision test

        const platformBounds = this.platform.getBounds()
        const ballBounds = this.ball.getBounds()

        if (ballBounds.bottom >= platformBounds.top
            && ballBounds.right >= platformBounds.left
            && ballBounds.top <= platformBounds.bottom
            && ballBounds.left <= platformBounds.right
        ) {
            if (this.ball.velocityY > 0) {
                this.ball.velocityY *= -1
            }
        }

    }
    public resize(width: number, height: number): void {
        const scale = Math.min(1, width / GAME_WIDTH, height / GAME_HEIGHT)

        this.scale.set(scale)
        this.x = (width - GAME_WIDTH * scale) / 2
        this.y = (height - GAME_HEIGHT * scale) / 2
    }
}