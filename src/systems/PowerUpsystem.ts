import * as PIXI from 'pixi.js'
import { Ball } from '../entities/Ball'

export type PowerUpType = 'threeBall' | 'extend' | 'tiny' | 'slow' | 'fast'
export type DroppedPowerUp = {
    type: PowerUpType
    sprite: PIXI.AnimatedSprite
}

export class PowerUpSystem {
    private powerUp3BallTextures = [
        'pup3ball_0.png',
        'pup3ball_1.png',
        'pup3ball_2.png',
        'pup3ball_3.png',
        'pup3ball_4.png',
        'pup3ball_5.png',
    ].map((name) => PIXI.Loader.shared.resources.game.textures![name])

    private powerUpExtendTextures = [
        'pup3extend_0.png',
        'pup3extend_1.png',
        'pup3extend_2.png',
        'pup3extend_3.png',
        'pup3extend_4.png',
        'pup3extend_5.png',
    ].map((name) => PIXI.Loader.shared.resources.game.textures![name])

    private powerDownTiny = [
        'pdowntiny_0.png',
        'pdowntiny_1.png',
        'pdowntiny_2.png',
        'pdowntiny_3.png',
        'pdowntiny_4.png',
        'pdowntiny_5.png',
    ].map((name) => PIXI.Loader.shared.resources.game.textures![name])

    private powerDownSlow = [
        'pdownslow_0.png',
        'pdownslow_1.png',
        'pdownslow_2.png',
        'pdownslow_3.png',
        'pdownslow_4.png',
        'pdownslow_5.png',
    ].map((name) => PIXI.Loader.shared.resources.game.textures![name])

    private powerUpFast = [
        'pupfast_0.png',
        'pupfast_1.png',
        'pupfast_2.png',
        'pupfast_3.png',
        'pupfast_4.png',
        'pupfast_5.png',
    ].map((name) => PIXI.Loader.shared.resources.game.textures![name])

    constructor() {

    }
    public dropPowerUp3Ball(delta: number) {
        const animated3Ball = new PIXI.AnimatedSprite(this.powerUp3BallTextures)
        animated3Ball.animationSpeed = 0.2 * delta
        animated3Ball.scale.set(2)
        animated3Ball.play()
        return animated3Ball
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
}