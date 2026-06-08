import * as PIXI from 'pixi.js'
import { GAME_HEIGHT, GAME_WIDTH, SCENE_HEIGHT, SCENE_WIDTH, TILE_SIZE } from '../constants'

export class GameFrame extends PIXI.Container {
    private uiNarrowTexture = PIXI.Loader.shared.resources.game.textures?.['ui_narrow.png']
    private uiWideTexture = PIXI.Loader.shared.resources.game.textures?.['ui_wide.png']
    private cornerTexture = PIXI.Loader.shared.resources.game.textures?.['ui_corner.png']
    private bgTexture = PIXI.Loader.shared.resources.game.textures?.['ui_bg.png']
    private bg = new PIXI.TilingSprite(this.bgTexture!, GAME_WIDTH, GAME_HEIGHT)

    constructor() {
        super()
        this.bg.tileScale.set(2)
        this.bg.position.set(TILE_SIZE, TILE_SIZE)
        this.addChild(
            this.bg
        )

        this.drawFrame()
    }
    private drawFrame(): void {
        const cols = SCENE_WIDTH / TILE_SIZE
        const rows = SCENE_HEIGHT / TILE_SIZE

        for (let col = 1; col < cols - 1; col++) {
            const texture = this.getFrameStickTexture(col - 1)

            this.addFrameTile(col, 0, texture, 90)
            this.addFrameTile(col, rows - 1, texture, -90)
        }

        for (let row = 1; row < rows - 1; row++) {
            const texture = this.getFrameStickTexture(row - 1)

            this.addFrameTile(0, row, texture, 0)
            this.addFrameTile(cols - 1, row, texture, 180)
        }

        this.addFrameTile(0, 0, this.cornerTexture!, 0)
        this.addFrameTile(cols - 1, 0, this.cornerTexture!, 90)
        this.addFrameTile(cols - 1, rows - 1, this.cornerTexture!, 180)
        this.addFrameTile(0, rows - 1, this.cornerTexture!, -90)
    }

    private getFrameStickTexture(index: number): PIXI.Texture {
        return index % 2 === 0
            ? this.uiWideTexture!
            : this.uiNarrowTexture!
    }

    private addFrameTile(col: number, row: number, texture: PIXI.Texture, angle: number): void {
        const sprite = new PIXI.Sprite(texture)

        sprite.width = TILE_SIZE
        sprite.height = TILE_SIZE
        sprite.anchor.set(0.5)
        sprite.angle = angle
        sprite.position.set(
            col * TILE_SIZE + TILE_SIZE / 2,
            row * TILE_SIZE + TILE_SIZE / 2
        )

        this.addChild(sprite)
    }
}