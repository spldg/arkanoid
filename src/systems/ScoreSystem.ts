import * as PIXI from 'pixi.js'

export class ScoreSystem extends PIXI.Container {
    private style = new PIXI.TextStyle({
        fontFamily: 'Pixelify Sans',
        fontSize: 26,
        fill: 0xffffff,
        stroke: 0x000000,
        strokeThickness: 3
    })

    private scoreText = new PIXI.Text('SCORE: 000000', this.style)
    private levelText = new PIXI.Text('LEVEL: 1', this.style)
    private livesText = new PIXI.Text('LIVES: 3', this.style)

    constructor() {
        super()

        this.scoreText.anchor.set(0, 0.5)
        this.scoreText.position.set(0, 2)

        this.levelText.anchor.set(1, 0.5)
        this.levelText.position.set(315, 2)

        this.livesText.anchor.set(1, 0.5)
        this.livesText.position.set(315, -17)

        this.addChild(
            this.scoreText,
            this.levelText,
            this.livesText,
        )
    }

    public setScore(score: number): void {
        this.scoreText.text = `SCORE: ${String(score).padStart(6, '0')}`
    }

    public setLives(lives: number): void {
        this.livesText.text = `LIVES: ${lives}`
    }

    public setLevel(level: number): void {
        this.levelText.text = `LEVEL: ${level}`
    }
}