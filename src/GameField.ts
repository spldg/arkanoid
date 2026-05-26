import * as PIXI from 'pixi.js'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'

export class GameField extends PIXI.Container {
    private background = PIXI.Sprite.from('/assets/background.png')

    constructor() {
        super()
        this.background.width = GAME_WIDTH
        this.background.height = GAME_HEIGHT

        this.addChild(
            this.background,
        )
    }
}