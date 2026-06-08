import * as PIXI from 'pixi.js'
import { GameField } from './GameField'
import { FRAME_SIZE, SCENE_HEIGHT, SCENE_WIDTH } from './constants'
export class GameScene extends PIXI.Container {
    private gameField = new GameField()

    constructor() {
        super()

        this.gameField.position.set(FRAME_SIZE, FRAME_SIZE)

        this.addChild(
            this.gameField,
        )
    }
    public update(delta: number) {
        this.gameField.update(delta)
    }

    public resize(width: number, height: number): void {
        const scale = Math.min(1, width / SCENE_WIDTH, height / SCENE_HEIGHT)

        this.scale.set(scale)
        this.x = (width - SCENE_WIDTH * scale) / 2
        this.y = (height - SCENE_HEIGHT * scale) / 2
    }
}