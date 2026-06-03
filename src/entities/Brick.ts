import * as PIXI from 'pixi.js'

export class Brick extends PIXI.Sprite {
    constructor (texture: PIXI.Texture) {
        super(texture)
        this.scale.set(0.75)
    }
}