import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import { FRAME_SIZE, GAME_LAYER_SCALE, LAYOUT_WIDTH, SCENE_HEIGHT, SCENE_WIDTH, TOP_UI_HEIGHT } from './constants'
import { music, roundStartFx } from './sound'
import { GameField } from './GameField'
import { StartMenu } from './StartMenu'
import { MobileControls } from './MobileControls'
import { ScoreSystem } from './systems/ScoreSystem'
export class GameScene extends PIXI.Container {
    private gameField = new GameField()
    private startMenu = new StartMenu()
    private scoreSystem = new ScoreSystem()

    private gameLayer = new PIXI.Container()

    private mobileControls = new MobileControls()

    private getReady = new PIXI.Sprite(
        PIXI.Loader.shared.resources.game.textures?.['getready.png']
    )
    private gameOver = new PIXI.Sprite(
        PIXI.Loader.shared.resources.game.textures?.['gameover.png']
    )

    private isGameOver = false
    private currentScore = 0

    constructor() {
        super()

        this.gameField.position.set(FRAME_SIZE, FRAME_SIZE)
        this.startMenu.position.set(0, 0)
        this.scoreSystem.position.set(50, 25)

        this.gameLayer.scale.set(GAME_LAYER_SCALE)
        this.gameLayer.position.set(
            (LAYOUT_WIDTH - SCENE_WIDTH * GAME_LAYER_SCALE) / 2,
            TOP_UI_HEIGHT - 50
        )

        this.mobileControls.position.set(0, TOP_UI_HEIGHT + SCENE_HEIGHT * GAME_LAYER_SCALE - 90)
        this.mobileControls.visible = false

        this.getReady.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT / 2)
        this.getReady.scale.set(2)
        this.getReady.anchor.set(0.5)
        this.getReady.visible = false

        this.gameOver.position.set(SCENE_WIDTH / 2, SCENE_HEIGHT / 2)
        this.gameOver.scale.set(2)
        this.gameOver.anchor.set(0.5)
        this.gameOver.visible = false

        this.gameField.visible = false
        this.scoreSystem.visible = false

        this.startMenu.setTopScore(this.getTopScore())

        this.startMenu.on('start', this.onStart)
        this.gameField.on('scoreChange', (score: number) => {
            this.currentScore = score
            this.scoreSystem.setScore(score)
        })
        this.gameField.on('livesChange', (lives: number) => {
            this.scoreSystem.setLives(lives)
        })
        this.mobileControls.on('leftDown', () => {
            this.gameField.setMoveLeft(true)
        })

        this.mobileControls.on('leftUp', () => {
            this.gameField.setMoveLeft(false)
        })

        this.mobileControls.on('rightDown', () => {
            this.gameField.setMoveRight(true)
        })

        this.mobileControls.on('rightUp', () => {
            this.gameField.setMoveRight(false)
        })

        this.mobileControls.on('launch', () => {
            this.gameField.launchBall()
        })

        this.gameField.on('levelChange', (level: number) => {
            this.scoreSystem.setLevel(level)
        })

        this.gameField.on('gameover', this.onGameOver)

        this.gameLayer.addChild(
            this.gameField,
            this.startMenu,
            this.getReady,
            this.gameOver,
        )
        this.addChild(
            this.scoreSystem,
            this.gameLayer,
            this.mobileControls,
        )
    }

    public update(delta: number): void {
        if (this.gameField.visible) {
            this.gameField.update(delta)
        }
    }

    public resize(width: number, height: number): void {
        const scale = Math.min(1, width / SCENE_WIDTH, height / SCENE_HEIGHT)

        this.scale.set(scale)
        this.x = (width - SCENE_WIDTH * scale) / 2
        this.y = (height - SCENE_HEIGHT * scale) / 2
    }

    private onStart = (): void => {
        this.isGameOver = false

        this.gameField.resetGame()

        this.startMenu.hide()
        this.scoreSystem.visible = true
        this.getReady.visible = true
        this.gameField.visible = true
        this.mobileControls.visible = this.isMobileInput()
        this.gameField.setInputEnabled(false)

        roundStartFx.play()

        gsap.delayedCall(3, () => {
            this.getReady.visible = false
            this.gameField.setInputEnabled(true)
            music.play()
        })
    }

    private onGameOver = (): void => {
        if (this.isGameOver) return

        this.isGameOver = true
        this.gameOver.visible = true

        this.saveTopScore(this.currentScore)

        gsap.delayedCall(3, () => {
            this.gameOver.visible = false
            this.gameField.visible = false
            this.scoreSystem.visible = false
            this.startMenu.show()
            this.startMenu.setTopScore(this.getTopScore())
            music.stop()
        })
    }

    private isMobileInput(): boolean {
        return window.matchMedia('(pointer: coarse)').matches
    }

    private getTopScore(): number {
        return Number(localStorage.getItem('arkanoidTopScore')) || 0
    }

    private saveTopScore(score: number): void {
        const topScore = this.getTopScore()

        if (score > topScore) {
            localStorage.setItem('arkanoidTopScore', String(score))
        }
    }
}