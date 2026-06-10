import * as PIXI from 'pixi.js'
import { BRICK_SCORE, FRAME_SIZE, GAME_HEIGHT, INITIAL_LIVES, levels, MAX_BOUNCE_SPEED, PLATFORM_X, STAGE_CLEAR_SCORE } from './constants'
import { Platform } from './entities/Platform'
import { Ball } from './entities/Ball'
import { collision, resolveBallBrickCollision } from './utils/collision'
import { BrickSystem } from './systems/BrickSystem'
import { GameFrame } from './entities/GameFrame'
import { DroppedPowerUp, PowerUpSystem } from './systems/PowerUpSystem'
import { gameOverFx, hit1Fx, hit2Fx, music, powerUpFx, stageClearFx } from './sound'

type GameState = 'ready' | 'playing' | 'gameOver' | 'paused'

export class GameField extends PIXI.Container {
    private background = new GameFrame()
    private platform = new Platform()
    private ball = new Ball()

    private brickSystem = new BrickSystem()
    private pUpSystem = new PowerUpSystem()

    private ballArr: Ball[] = []
    private powerUps: DroppedPowerUp[] = []

    private isLaunched = false
    private state: GameState = 'ready'
    private inputEnabled = false

    private score = 0
    private levelIndex = 0
    private lives = INITIAL_LIVES

    constructor() {
        super()

        this.brickSystem.loadLevel(levels[this.levelIndex])
        this.ballArr.push(this.ball)
        this.background.position.set(-FRAME_SIZE, -FRAME_SIZE)

        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)

        this.addChild(
            this.background,
            this.platform,
            this.ball,
            this.brickSystem,
        )
    }

    public update(delta: number): void {
        if (this.state === 'gameOver') return

        this.platform.update(delta)

        if (!this.isLaunched) {
            this.ball.x = this.platform.x
            this.ball.y = this.platform.y - this.platform.height / 2 - this.ball.radius
            return
        }

        for (const ball of this.ballArr) {
            ball.update(delta)
            if (collision(this.platform, ball)) {
                if (ball.velocityY > 0) {
                    const hitPosition = (ball.x - this.platform.x) / (this.platform.width / 2)
                    ball.velocityX = hitPosition * MAX_BOUNCE_SPEED
                    ball.velocityY = -Math.abs(ball.velocityY)
                    hit1Fx.play()
                }
            }

            const brickHit = this.brickSystem.checkForCollisions(ball)

            if (brickHit) {
                hit2Fx.play()

                resolveBallBrickCollision(ball, brickHit.brick)

                if (brickHit.type === 'breakable') {
                    this.score += BRICK_SCORE * (this.levelIndex + 1)
                    this.emit('scoreChange', this.score)

                    if (Math.random() < 0.2) {
                        const powerUp = this.pUpSystem.dropRandomPowerUp()
                        powerUp.sprite.position.set(ball.x, ball.y)
                        this.powerUps.push(powerUp)
                        this.addChild(powerUp.sprite)
                    }

                    if (this.brickSystem.isCleared()) {
                        this.nextLevel()
                    }
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

                powerUpFx.play()

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

    public setInputEnabled(value: boolean): void {
        this.inputEnabled = value
    }

    public setMoveLeft(value: boolean): void {
        if (!this.inputEnabled) return

        this.platform.moveLeft = value
    }

    public setMoveRight(value: boolean): void {
        if (!this.inputEnabled) return

        this.platform.moveRight = value
    }

    public launchBall(): void {
        if (!this.inputEnabled) return

        this.launch()
    }

    public resetGame(): void {
        this.score = 0
        this.lives = INITIAL_LIVES
        this.levelIndex = 0
        this.state = 'ready'
        this.inputEnabled = false
        this.isLaunched = false

        this.platform.x = PLATFORM_X
        this.platform.moveLeft = false
        this.platform.moveRight = false

        this.emit('scoreChange', this.score)
        this.emit('livesChange', this.lives)
        this.emit('levelChange', this.levelIndex + 1)

        this.brickSystem.loadLevel(levels[this.levelIndex])
        this.resetRound()
    }

    private onKeyDown = (event: KeyboardEvent) => {
        if (!this.inputEnabled) return

        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.setMoveLeft(true)
                break

            case 'ArrowRight':
            case 'KeyD':
                this.setMoveRight(true)
                break

            case 'Space':
                this.launchBall()
                break
        }
    }

    private onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.setMoveLeft(false)
                break

            case 'ArrowRight':
            case 'KeyD':
                this.setMoveRight(false)
                break
        }
    }

    private launch(): void {
        if (this.isLaunched) return

        hit1Fx.play()
        this.isLaunched = true
        this.ball.velocityX = 3
        this.ball.velocityY = -5
    }

    private resetRound(): void {
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
            this.loseLife()
        }
    }

    private loseLife(): void {
        this.lives--
        this.emit('livesChange', this.lives)

        if (this.lives <= 0) {
            this.setGameOver()
            return
        }

        this.resetRound()
    }

    private nextLevel(): void {
        this.levelIndex++

        if (this.levelIndex >= levels.length) {
            this.levelIndex = 0
        }

        this.emit('levelChange', this.levelIndex + 1)
        stageClearFx.play()


        this.score += STAGE_CLEAR_SCORE * (this.levelIndex + 1)

        this.emit('scoreChange', this.score)

        this.brickSystem.loadLevel(levels[this.levelIndex])
        this.resetRound()
    }

    private setGameOver(): void {
        if (this.state === 'gameOver') return

        this.state = 'gameOver'
        this.inputEnabled = false
        gameOverFx.play()
        music.stop()
        this.emit('gameover')
    }
}