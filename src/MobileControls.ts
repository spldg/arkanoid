import * as PIXI from 'pixi.js'
import { LAYOUT_WIDTH } from './constants'

export class MobileControls extends PIXI.Container {
    private leftButton = this.createArrowButton('←')
    private launchButton = this.createLaunchButton()
    private rightButton = this.createArrowButton('→')

    constructor() {
        super()

        this.leftButton.position.set(70, 45)
        this.launchButton.position.set(LAYOUT_WIDTH / 2, 45)
        this.rightButton.position.set(LAYOUT_WIDTH - 70, 45)

        this.leftButton.on('pointerdown', () => {
            this.emit('leftDown')
        })
        this.leftButton.on('pointerup', () => {
            this.emit('leftUp')
        })
        this.leftButton.on('pointerupoutside', () => {
            this.emit('leftUp')
        })

        this.rightButton.on('pointerdown', () => {
            this.emit('rightDown')
        })
        this.rightButton.on('pointerup', () => {
            this.emit('rightUp')
        })
        this.rightButton.on('pointerupoutside', () => {
            this.emit('rightUp')
        })

        this.launchButton.on('pointertap', () => {
            this.emit('launch')
        })

        this.addChild(
            this.leftButton,
            this.launchButton,
            this.rightButton,
        )
    }

    private createArrowButton(label: string): PIXI.Container {
        const container = new PIXI.Container()
        const hitArea = new PIXI.Graphics()
        const text = new PIXI.Text(label, {
            fontFamily: 'Pixelify Sans',
            fontSize: 64,
            fill: 0xffed00,
        })

        hitArea
            .beginFill(0xffffff, 0.001)
            .drawRect(-60, -40, 120, 80)
            .endFill()

        text.anchor.set(0.5)

        container.interactive = true
        container.buttonMode = true

        container.addChild(
            hitArea,
            text,
        )

        return container
    }

    private createLaunchButton(): PIXI.Container {
        const container = new PIXI.Container()
        const hitArea = new PIXI.Graphics()
        const text = new PIXI.Text('LAUNCH', {
            fontFamily: 'Pixelify Sans',
            fontSize: 32,
            fill: 0xffed00,
        })

        hitArea
            .beginFill(0xffffff, 0.001)
            .drawRect(-85, -40, 170, 80)
            .endFill()

        text.anchor.set(0.5)

        container.interactive = true
        container.buttonMode = true

        container.addChild(
            hitArea,
            text,
        )

        return container
    }
}