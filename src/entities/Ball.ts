import * as PIXI from 'pixi.js'
import { GAME_HEIGHT, GAME_WIDTH, PLATFORM_X, PLATFORM_Y } from '../constants'

export class Ball extends PIXI.Container {
    public velocityX = 6
    public velocityY = 10
    public isLaunched = false
    private sprite = PIXI.Sprite.from('/assets/ball.png')

    constructor() {
        super()
        this.y = 200
        this.x = 200
        this.sprite.width = 16
        this.sprite.height = 16
        this.reset()
        this.sprite.anchor.set(0.5)
        this.addChild(
            this.sprite
        )
    }

    public get radius(): number {
        return this.sprite.width / 2
    }

    public update(delta: number) {
        this.x += this.velocityX * delta
        this.y += this.velocityY * delta

        if (this.x + this.radius > GAME_WIDTH && this.velocityX > 0) {
            this.x = GAME_WIDTH - this.radius
            this.velocityX *= -1
        }

        if (this.x <= this.radius && this.velocityX < 0) {
            this.x = this.radius
            this.velocityX *= -1
        }

        if (this.y <= this.radius && this.velocityY < 0) {
            this.y = this.radius
            this.velocityY *= -1
        }

        if (this.y - this.radius >= GAME_HEIGHT) {
            this.reset()
        }
    }

    public launch(): void {
        if (this.isLaunched) return

        this.isLaunched = true
        this.velocityX = 6
        this.velocityY = -10
    }

    private reset(): void {
        this.isLaunched = false
        this.velocityX = 0
        this.velocityY = 0
        this.x = PLATFORM_X
        this.y = PLATFORM_Y - 20
    }
}