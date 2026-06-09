import * as PIXI from 'pixi.js'
import gsap from 'gsap'
import { Ball } from '../entities/Ball'
import { POWER_UP_FRAMES, POWER_UP_TABLE } from '../constants'
import { Platform } from '../entities/Platform'

export type PowerUpType = 'threeBall' | 'extend' | 'tiny' | 'slow' | 'fast'
export type DroppedPowerUp = {
    type: PowerUpType
    sprite: PIXI.AnimatedSprite
}

type ApplyPowerUpOptions = {
    type: PowerUpType
    platform: Platform
    balls: Ball[]
}
export class PowerUpSystem {
    private platformSizetimer?: gsap.core.Tween
    public dropRandomPowerUp(): DroppedPowerUp {
        const type = this.rollPowerUpType()
        const sprite = this.createAnimatedPowerUp(type)

        return { type, sprite }
    }

    public applyPowerUp(options: ApplyPowerUpOptions) {
        switch (options.type) {
            case 'threeBall': {
                const mainBall = options.balls[0]

                return this.threeBall(mainBall)
            }
            case 'extend':
                this.applyPlatformSize(options.platform, 100)
                break
            case 'tiny':
                this.applyPlatformSize(options.platform, 45)
                break
            case 'slow':
                for (const ball of options.balls) {
                    ball.velocityX *= 0.70
                    ball.velocityY *= 0.70

                    gsap.delayedCall(10, () => {
                        ball.velocityX /= 0.70
                        ball.velocityY /= 0.70
                    })
                }
                break
            case 'fast':
                for (const ball of options.balls) {
                    ball.velocityX *= 1.25
                    ball.velocityY *= 1.25

                    gsap.delayedCall(10, () => {
                        ball.velocityX /= 1.25
                        ball.velocityY /= 1.25
                    })
                }
                break
        }
        return []
    }

    private applyPlatformSize(platform: Platform, width: number): void {
        this.platformSizetimer?.kill()

        platform.resizeTo(width)

        this.platformSizetimer = gsap.delayedCall(10, () => {
            platform.resizeTo(70)
            this.platformSizetimer = undefined
        })
    }

    private threeBall(ball: Ball) {
        const secondBall = new Ball()
        const thirdBall = new Ball()
        secondBall.position.set(ball.x, ball.y)
        thirdBall.position.set(ball.x, ball.y)

        secondBall.velocityY = ball.velocityY
        secondBall.velocityX = 6

        thirdBall.velocityY = ball.velocityY
        thirdBall.velocityX = -6

        return [secondBall, thirdBall]
    }

    private rollPowerUpType(): PowerUpType {
        const totalWeight = POWER_UP_TABLE.reduce((sum, item) => sum + item.weight, 0)
        let roll = Math.random() * totalWeight

        for (const item of POWER_UP_TABLE) {
            roll -= item.weight

            if (roll <= 0) {
                return item.type
            }
        }
        return POWER_UP_TABLE[0].type
    }

    private createAnimatedPowerUp(type: PowerUpType): PIXI.AnimatedSprite {
        const textures = POWER_UP_FRAMES[type].map((name) => {
            return PIXI.Loader.shared.resources.game.textures![name]
        })

        const sprite = new PIXI.AnimatedSprite(textures)

        sprite.animationSpeed = 0.12
        sprite.loop = true
        sprite.scale.set(2)
        sprite.play()

        return sprite
    }
}