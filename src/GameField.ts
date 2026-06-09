import * as PIXI from 'pixi.js'
import { FRAME_SIZE, GAME_HEIGHT, MAX_BOUNCE_SPEED } from './constants'
import { Platform } from './entities/Platform'
import { Ball } from './entities/Ball'
import { collision } from './utils/collision'
import { BrickSystem } from './systems/BrickSystem'
import { EventEmitter } from './utils/EventEmitter'
import { ScoreSystem } from './systems/ScoreSystem'
import { GameFrame } from './entities/GameFrame'
import { DroppedPowerUp, PowerUpSystem } from './systems/PowerUpSystem'

export class GameField extends PIXI.Container {
    private emitter = new EventEmitter()
    private background = new GameFrame()
    private platform = new Platform()
    private ball = new Ball()
    private scoreSystem = new ScoreSystem()
    private brickSystem = new BrickSystem()
    private pUpSystem = new PowerUpSystem()
    private ballArr: Ball[] = []
    private powerUps: DroppedPowerUp[] = []
    private isLaunched = false
    private score = 0

    constructor() {
        super()
        this.ballArr.push(this.ball)
        this.background.position.set(-FRAME_SIZE, -FRAME_SIZE)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
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

        for (const ball of this.ballArr) {
            ball.update(delta)
            if (collision(this.platform, ball)
            ) {
                if (ball.velocityY > 0) {
                    const hitPosition = (ball.x - this.platform.x) / (this.platform.width / 2)
                    ball.velocityX = hitPosition * MAX_BOUNCE_SPEED
                    ball.velocityY = -Math.abs(ball.velocityY)
                }
            }

            if (this.brickSystem.checkForCollisions(ball)) {
                this.emitter.emit('brickHit')
                ball.velocityY *= -1

                if (Math.random() < 0.2) {
                    const powerUp = this.pUpSystem.dropRandomPowerUp()
                    powerUp.sprite.position.set(ball.x, ball.y)
                    this.powerUps.push(powerUp)
                    this.addChild(powerUp.sprite)
                }
            }
        }

        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i]

            powerUp.sprite.y += 1 * delta

            if (powerUp.sprite.y >= GAME_HEIGHT) {
                this.removeChild(powerUp.sprite)
                powerUp.sprite.destroy()
                PIXI.utils.removeItems(this.powerUps, i, 1)
                continue
            }

            if (collision(powerUp.sprite, this.platform)) {
                const newBalls = this.pUpSystem.applyPowerUp({
                    type: powerUp.type,
                    platform: this.platform,
                    balls: this.ballArr,
                })

                if (newBalls.length > 0) {
                    this.ballArr.push(...newBalls)
                    this.addChild(...newBalls)
                }
                this.removeChild(powerUp.sprite)
                powerUp.sprite.destroy()
                PIXI.utils.removeItems(this.powerUps, i, 1)

            }
        }


        this.removeLostBalls()
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
        for (const ball of this.ballArr) {
            this.removeChild(ball)
            ball.destroy()
        }

        for (const powerUp of this.powerUps) {
            this.removeChild(powerUp.sprite)
            powerUp.sprite.destroy()
        }

        this.ballArr.length = 0
        this.powerUps.length = 0

        this.ball = new Ball()
        this.ball.velocityX = 0
        this.ball.velocityY = 0

        this.ballArr.push(this.ball)
        this.addChild(this.ball)
        this.isLaunched = false
    }

    private removeLostBalls(): void {
        for (let i = this.ballArr.length - 1; i >= 0; i--) {
            const ball = this.ballArr[i]

            if (ball.y - ball.radius >= GAME_HEIGHT) {
                this.removeChild(ball)
                ball.destroy()

                PIXI.utils.removeItems(this.ballArr, i, 1)
            }
        }

        if (this.ballArr.length === 0) {
            this.reset()
        }
    }
}