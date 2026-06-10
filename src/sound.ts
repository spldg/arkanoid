import { Howl } from 'howler'

export const music = new Howl({
    src: ['./assets/music.mp3'],
    loop: true,
    volume: 0.4,
})

export const powerUpFx = new Howl({
    src: ['./assets/powerup.mp3'],
    volume: 0.4,
})

export const hit1Fx = new Howl({
    src: ['./assets/hit1.mp3'],
    volume: 0.4,
})

export const hit2Fx = new Howl({
    src: ['./assets/hit2.mp3'],
    volume: 0.4,
})

export const pauseFx = new Howl({
    src: ['./assets/pause.mp3'],
    volume: 0.4,
})

export const gameOverFx = new Howl({
    src: ['./assets/gameOver.mp3'],
    volume: 0.4,
})

export const roundStartFx = new Howl({
    src: ['./assets/roundStart.mp3'],
    volume: 0.4,
})

export const stageClearFx = new Howl({
    src: ['./assets/stageclear.mp3'],
    volume: 0.4,
})

export const fxSounds = [
    powerUpFx,
    hit1Fx,
    hit2Fx,
    pauseFx,
    gameOverFx,
    roundStartFx,
    stageClearFx,
]

export function setMusicVolume(level: number): void {
    music.volume(level / 5)

    localStorage.setItem('arkanoidMusicLevel', String(level))
}

export function setFxVolume(level: number): void {
    const volume = level / 5

    for (const sound of fxSounds) {
        sound.volume(volume)
    }

    localStorage.setItem('arkanoidFxLevel', String(level))
}

export function applySavedSoundSettings(): void {
    const musicLevel = Number(localStorage.getItem('arkanoidMusicLevel') ?? 3)
    const fxLevel = Number(localStorage.getItem('arkanoidFxLevel') ?? 3)

    setMusicVolume(musicLevel)
    setFxVolume(fxLevel)
}