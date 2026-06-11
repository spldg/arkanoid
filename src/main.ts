import * as PIXI from 'pixi.js'
import { GameScene } from './GameScene'
import { applySavedSoundSettings, loadSounds } from './sound'
import { ASSET_VERSION } from './constants'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

function loadTextures(): Promise<void> {
    return new Promise((resolve, reject) => {
        const loader = PIXI.Loader.shared

        loader.onError.once((error) => {
            reject(error)
        })

        loader
            .add('game', `./assets/atlas.json?v=${ASSET_VERSION}`)
            .load(() => {
                resolve()
            })
    })
}

async function loadFonts(): Promise<void> {
    await document.fonts.load('24px "Pixelify Sans"')
}

async function bootstrap(): Promise<void> {
    await Promise.all([
        loadTextures(),
        loadSounds(),
        loadFonts(),
    ])

    const app = new PIXI.Application({
        resizeTo: window,
        backgroundColor: 0x202020,
        antialias: false,
    })

    const container = document.getElementById('pixi-container')
    if (!container) {
        throw new Error('container not found')
    }

    container.appendChild(app.view)

    const gameScene = new GameScene()
    app.stage.addChild(gameScene)

    function resize(): void {
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
}

bootstrap()