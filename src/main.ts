import * as PIXI from 'pixi.js'
import { GameScene } from './GameScene'
import { applySavedSoundSettings } from './sound'
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x202020,
    antialias: false
})

const container = document.getElementById('pixi-container')
if (!container) {
    throw new Error('container not found')
}

container.appendChild(app.view)

PIXI.Loader.shared
    .add('game', './assets/atlas.json')
    .load(async () => {
        await document.fonts.load('24px "Pixelify Sans"')

        const gameScene = new GameScene()
        app.stage.addChild(gameScene)

        function resize() {
            const width = window.innerWidth
            const height = window.innerHeight

            gameScene.resize(width, height)
        }

        applySavedSoundSettings()
        resize()
        window.addEventListener('resize', resize)

        app.ticker.add((delta) => {
            gameScene.update(delta)
        })
    })