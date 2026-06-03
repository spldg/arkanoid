import * as PIXI from 'pixi.js'
import { GameField } from './GameField'
import { GAME_HEIGHT, GAME_WIDTH } from './constants'
export class GameScene extends PIXI.Container {
    private gameField = new GameField()

    constructor() {
        super()

        this.addChild(
            this.gameField,
        )
    }
    public update(delta: number) {
        this.gameField.update(delta)
    }

    public resize(width: number, height: number): void {
        const scale = Math.min(1, width / GAME_WIDTH, height / GAME_HEIGHT)

        this.scale.set(scale)
        this.x = (width - GAME_WIDTH * scale) / 2
        this.y = (height - GAME_HEIGHT * scale) / 2
    }
}