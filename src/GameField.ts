import * as PIXI from 'pixi.js'
import { GAME_HEIGHT, GAME_WIDTH, MAX_BOUNCE_SPEED, PLATFORM_X, PLATFORM_Y } from './constants'
import { Platform } from './entities/Platform'
import { Ball } from './entities/Ball'
import { collision } from './utils/collision'
import { BrickSystem } from './entities/BrickSystem'

export class GameField extends PIXI.Container {
    private background = PIXI.Sprite.from('/assets/background.png')
    private platform = new Platform()
    private ball = new Ball()
    private brickSystem = new BrickSystem()
    private isLaunched = false

    constructor() {
        super()

        this.background.width = GAME_WIDTH
        this.background.height = GAME_HEIGHT
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        this.addChild(
            this.background,
            this.platform,
            this.ball,
            this.brickSystem,
        )
    }

    public update(delta: number) {
        this.platform.update(delta)
        this.ball.update(delta)

        if(!this.isLaunched) {
            this.ball.x = this.platform.x
            this.ball.y = this.platform.y - 20
        }

        // temporary collision test

        if (collision(this.platform, this.ball)
        ) {
            if (this.ball.velocityY > 0) {
                const hitPosition = (this.ball.x - this.platform.x) / (this.platform.width / 2)
                this.ball.velocityX = hitPosition * MAX_BOUNCE_SPEED
                this.ball.velocityY = -Math.abs(this.ball.velocityY)
            }
        }

        if (this.brickSystem.checkForCollisions(this.ball)) {
            this.ball.velocityY *= -1
        }

        if (this.ball.y - this.ball.radius >= GAME_HEIGHT) {
            this.reset()
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.platform.moveLeft = true
                break

            case 'ArrowRight':
            case 'KeyD':
                this.platform.moveRight = true
                break
            case 'Space':
                this.launch()
                break
        }
    }

    private onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.platform.moveLeft = false
                break

            case 'ArrowRight':
            case 'KeyD':
                this.platform.moveRight = false
                break
        }
    }

    private launch(): void {
        if (this.isLaunched) return

        this.isLaunched = true
        this.ball.velocityX = 6
        this.ball.velocityY = -10
    }

    private reset(): void {
        this.isLaunched = false
        this.ball.velocityX = 0
        this.ball.velocityY = 0
    }
}