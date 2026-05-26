import * as PIXI from 'pixi.js'
import { GAME_WIDTH } from '../constants'

export class Ball extends PIXI.Container {
    public velocityX = 2
    public velocityY = 3
    private sprite = PIXI.Sprite.from('assets/ball.png')

    constructor() {
        super()
        this.y = 10
        this.x = 10
        this.sprite.width = 16
        this.sprite.height = 16
        this.sprite.anchor.set(0.5)
        this.addChild(
            this.sprite
        )
    }

    public get radius(): number {
        return this.sprite.width / 2
    }

    public update() {
        this.x += this.velocityX
        this.y += this.velocityY

        if (this.x + this.radius > GAME_WIDTH) {
            this.velocityX *= -1
        }

        if (this.x <= this.radius) {
            this.velocityX *= -1
        }

        if (this.y <= this.radius) {
            this.velocityY *= -1
        }
    }

}