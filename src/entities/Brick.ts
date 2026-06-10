import * as PIXI from 'pixi.js'
import { BRICK_HEIGHT, BRICK_WIDTH } from '../constants'

export class Brick extends PIXI.Sprite {
    public readonly isBreakable: boolean

    constructor(texture: PIXI.Texture, isBreakable = true) {
        super(texture)

        this.isBreakable = isBreakable
        this.width = BRICK_WIDTH
        this.height = BRICK_HEIGHT
    }
}