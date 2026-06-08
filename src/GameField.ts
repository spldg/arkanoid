import * as PIXI from 'pixi.js'
import { FRAME_SIZE, GAME_HEIGHT, MAX_BOUNCE_SPEED } from './constants'
import { Platform } from './entities/Platform'
import { Ball } from './entities/Ball'
import { collision } from './utils/collision'
import { BrickSystem } from './systems/BrickSystem'
import { EventEmitter } from './utils/EventEmitter'
import { ScoreSystem } from './systems/ScoreSystem'
import { GameFrame } from './entities/GameFrame'

export class GameField extends PIXI.Container {
    private emitter = new EventEmitter()
    private background = new GameFrame()
    private platform = new Platform()
    private ball = new Ball()
    private scoreSystem = new ScoreSystem()
    private brickSystem = new BrickSystem()
    private isLaunched = false
    private score = 0

    constructor() {
        super()

        this.background.position.set(-FRAME_SIZE, -FRAME_SIZE)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        this.emitter.on('ballLost', () => {
            this.reset()
        })
        this.emitter.on('brickHit', () => {
            this.scoreSystem.setScore(this.score += 10)
        })
        this.addChild(
            this.background,
            this.platform,
            this.ball,
            this.brickSystem,
            this.scoreSystem,
        )
    }

    public update(delta: number) {
        this.platform.update(delta)

        if (!this.isLaunched) {
            this.ball.x = this.platform.x
            this.ball.y = this.platform.y - this.platform.height / 2 - this.ball.radius
            return
        }

        this.ball.update(delta)

        // temporary collision test

        if (collision(this.platform, this.ball)
        ) {
            if (this.ball.velocityY > 0) {
                const hitPosition = (this.ball.x - this.platform.x) / (this.platform.width / 2)
                this.ball.velocityX = hitPosition * MAX_BOUNCE_SPEED
                this.ball.velocityY = -Math.abs(this.ball.velocityY)
            }
        }

        if (this.brickSystem.checkForCollisions(this.ball)) {
            this.emitter.emit('brickHit')
            this.ball.velocityY *= -1
        }

        if (this.ball.y - this.ball.radius >= GAME_HEIGHT) {
            this.emitter.emit('ballLost')
        }
    }

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.platform.moveLeft = true
                break

            case 'ArrowRight':
            case 'KeyD':
                this.platform.moveRight = true
                break
            case 'Space':
                this.launch()
                break
        }
    }

    private onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.platform.moveLeft = false
                break

            case 'ArrowRight':
            case 'KeyD':
                this.platform.moveRight = false
                break
        }
    }

    private launch(): void {
        if (this.isLaunched) return

        this.isLaunched = true
        this.ball.velocityX = 6
        this.ball.velocityY = -10
    }

    private reset(): void {
        this.isLaunched = false
        this.ball.velocityX = 0
        this.ball.velocityY = 0
    }
}