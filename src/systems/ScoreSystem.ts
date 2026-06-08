import * as PIXI from 'pixi.js'

export class ScoreSystem extends PIXI.Container {
    private style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: 0xffffff,
    })
    private text = new PIXI.Text('Score: 0', this.style)
    constructor() {
        super()

        this.addChild(this.text)
    }
    public setScore(score: number) {
        this.text.text = `Score: ${score}`
    }
}