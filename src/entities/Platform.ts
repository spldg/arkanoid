import * as PIXI from 'pixi.js'
import { clamp } from '../utils/clamp'
import { GAME_WIDTH, PLATFORM_X, PLATFORM_Y } from '../constants'

export class Platform extends PIXI.Container {
    private texture = PIXI.Texture.from('/assets/paddle.png')
    private speed = 4
    private moveLeft = false
    private moveRight = false

    private platform = new PIXI.NineSlicePlane(
        this.texture,
        26,
        8,
        25,
        8)
    constructor() {
        super()
        this.platform.width = 100
        this.platform.height = 28
        this.platform.pivot.set(
            this.platform.width / 2,
            this.platform.height / 2
        )
        this.x = PLATFORM_X
        this.y = PLATFORM_Y

        this.addChild(
            this.platform,
        )
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }
    public update() {
        if (this.moveLeft) {
            this.x -= this.speed
        }

        if (this.moveRight) {
            this.x += this.speed
        }

        this.x = clamp(
            this.x,
            this.platform.width / 2,
            GAME_WIDTH - this.platform.width / 2
        )
    }

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = true
                break

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = true
                break
        }
    }

    private onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.moveLeft = false
                break

            case 'ArrowRight':
            case 'KeyD':
                this.moveRight = false
                break
        }
    }
}