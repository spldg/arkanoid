import * as PIXI from 'pixi.js'
import { clamp } from '../utils/clamp'
import { GAME_WIDTH, PLATFORM_X, PLATFORM_Y } from '../constants'

export class Platform extends PIXI.Container {
    public moveLeft = false
    public moveRight = false
    private texture = PIXI.Loader.shared.resources.game.textures?.['paddle.png']
    private speed = 8
    private platform
    constructor() {
        super()
        this.platform = new PIXI.NineSlicePlane(this.texture!, 2, 0, 2, 0)
        this.platform.width = 70
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
    }
    public update(delta: number) {
        if (this.moveLeft) {
            this.x -= this.speed * delta
        }

        if (this.moveRight) {
            this.x += this.speed * delta
        }

        this.x = clamp(
            this.x,
            this.platform.width / 2,
            GAME_WIDTH - this.platform.width / 2
        )
    }
}