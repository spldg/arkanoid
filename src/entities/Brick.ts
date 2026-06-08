import * as PIXI from 'pixi.js'
import { BRICK_HEIGHT, BRICK_WIDTH } from '../constants'

export class Brick extends PIXI.Sprite {
    constructor (texture: PIXI.Texture) {
        super(texture)
        this.width = BRICK_WIDTH
        this.height = BRICK_HEIGHT
    }
}