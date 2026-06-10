import * as PIXI from 'pixi.js'
import { GAME_WIDTH, FRAME_SIZE } from './constants'
import { StartMenuFrame } from './entities/StartMenuFrame'
import { pauseFx, setFxVolume, setMusicVolume } from './sound'

export class StartMenu extends PIXI.Container {
    private textures = PIXI.Loader.shared.resources.game.textures!

    private frame = new StartMenuFrame()
    private title = new PIXI.Sprite(this.textures['arkanoidTitle.png'])
    private playButton = new PIXI.Sprite(this.textures['btnplay.png'])
    private musicLabel = new PIXI.Sprite(this.textures['music.png'])
    private fxLabel = new PIXI.Sprite(this.textures['fx.png'])
    private topScoreLabel = new PIXI.Sprite(this.textures['topScore.png'])
    private playButtonBorder = new PIXI.Graphics()
    private topScoreText = new PIXI.Text('000000', {
        fontFamily: 'Pixelify Sans',
        fontSize: 40,
        fill: 0xf10909,
    })

    private musicLevel = Number(localStorage.getItem('arkanoidMusicLevel') ?? 3)
    private fxLevel = Number(localStorage.getItem('arkanoidFxLevel') ?? 3)

    private musicBars: PIXI.Graphics[] = []
    private fxBars: PIXI.Graphics[] = []

    constructor() {
        super()

        setMusicVolume(this.musicLevel)
        setFxVolume(this.fxLevel)

        this.setupTopScore()
        this.setupTitle()
        this.setupPlayButton()
        this.setupSoundLabels()

        this.show()

        this.addChild(
            this.frame,
            this.topScoreLabel,
            this.topScoreText,
            this.title,
            this.playButtonBorder,
            this.playButton,
            this.musicLabel,
            this.fxLabel,
        )

        this.drawVolumeBars()
    }

    public show(): void {
        this.visible = true
    }

    public hide(): void {
        this.visible = false
    }

    public setTopScore(score: number): void {
        this.topScoreText.text = String(score).padStart(6, '0')
    }

    private setupTopScore(): void {
        this.topScoreLabel.anchor.set(0.5)
        this.topScoreLabel.scale.set(3)
        this.topScoreLabel.position.set(FRAME_SIZE + GAME_WIDTH / 2, 250)
        this.topScoreText.anchor.set(0.5)
        this.topScoreText.position.set(FRAME_SIZE + GAME_WIDTH / 2, 295)
    }

    private setupTitle(): void {
        this.title.anchor.set(0.5)
        this.title.scale.set(4)
        this.title.position.set(FRAME_SIZE + GAME_WIDTH / 2, 160)
    }

    private setupPlayButton(): void {
        this.playButton.anchor.set(0.5)
        this.playButton.scale.set(4)
        this.playButton.position.set(FRAME_SIZE + GAME_WIDTH / 2, 400)

        const padding = 24

        this.playButtonBorder
            .lineStyle(4, 0x14cf1b)
            .drawRect(-this.playButton.width / 2 - padding, -this.playButton.height / 2 - padding, this.playButton.width + padding * 2, this.playButton.height + padding * 2)

        this.playButtonBorder.position.copyFrom(this.playButton.position)

        this.playButton.interactive = true
        this.playButton.buttonMode = true

        this.playButton.on('pointertap', () => {
            this.emit('start')
        })
    }

    private setupSoundLabels(): void {
        this.musicLabel.anchor.set(0, 0.5)
        this.musicLabel.scale.set(3)
        this.musicLabel.position.set(FRAME_SIZE + 70, 550)

        this.fxLabel.anchor.set(0, 0.5)
        this.fxLabel.scale.set(3)
        this.fxLabel.position.set(FRAME_SIZE + 70, 620)
    }

    private drawVolumeBars(): void {
        this.drawBars(this.musicBars, FRAME_SIZE + 210, 550, this.musicLevel, 'music')
        this.drawBars(this.fxBars, FRAME_SIZE + 210, 620, this.fxLevel, 'fx')
    }


    private drawBars(bars: PIXI.Graphics[], x: number, y: number, activeCount: number, kind: 'music' | 'fx'): void {
        const barCount = 5
        const barWidth = 14
        const barHeight = 28
        const gap = 8

        for (let i = 0; i < barCount; i++) {
            const bar = new PIXI.Graphics()
            const isActive = i < activeCount

            bar
                .beginFill(isActive ? 0xffed00 : 0x4a3f00)
                .drawRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight)
                .endFill()

            bar.position.set(x + i * (barWidth + gap), y)
            bar.interactive = true
            bar.buttonMode = true

            bar.on('pointertap', () => {
                const level = i + 1

                if (kind === 'music') {
                    this.musicLevel = level
                    setMusicVolume(level)
                    pauseFx.play()
                    this.redrawMusicBars()
                } else {
                    this.fxLevel = level
                    setFxVolume(level)
                    pauseFx.play()
                    this.redrawFxBars()
                }
            })

            bars.push(bar)
            this.addChild(bar)
        }
    }
    private redrawMusicBars(): void {
        this.clearBars(this.musicBars)
        this.drawBars(this.musicBars, FRAME_SIZE + 210, 550, this.musicLevel, 'music')
    }

    private redrawFxBars(): void {
        this.clearBars(this.fxBars)
        this.drawBars(this.fxBars, FRAME_SIZE + 210, 620, this.fxLevel, 'fx')
    }

    private clearBars(bars: PIXI.Graphics[]): void {
        for (const bar of bars) {
            this.removeChild(bar)
            bar.destroy()
        }

        bars.length = 0
    }
}