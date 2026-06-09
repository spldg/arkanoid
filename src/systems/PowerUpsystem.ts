import * as PIXI from 'pixi.js'
import { Ball } from '../entities/Ball'
import { POWER_UP_FRAMES, POWER_UP_TABLE } from '../constants'

export type PowerUpType = 'threeBall' | 'extend' | 'tiny' | 'slow' | 'fast'
export type DroppedPowerUp = {
    type: PowerUpType
    sprite: PIXI.AnimatedSprite
}

export class PowerUpSystem {
    public dropRandomPowerUp(): DroppedPowerUp {
        const type = this.rollPowerUpType()
        const sprite = this.createAnimatedPowerUp(type)

        return { type, sprite }
    }

    public threeBall(ball: Ball) {
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
        const TotalWeight = POWER_UP_TABLE.reduce((sum, item) => sum + item.weight, 0)
        let roll = Math.random() * TotalWeight

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