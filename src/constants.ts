import type { PowerUpType } from './systems/PowerUpSystem'

// sizes

export const GAME_WIDTH = 352
export const GAME_HEIGHT = 800

export const SOURCE_TILE_SIZE = 16
export const TILE_SIZE = 32
export const FRAME_SIZE = TILE_SIZE
export const SCENE_WIDTH = GAME_WIDTH + FRAME_SIZE * 2
export const SCENE_HEIGHT = GAME_HEIGHT + FRAME_SIZE * 2
export const PIECE_SIZE = 5
export const TOP_UI_HEIGHT = 80
export const BOTTOM_UI_HEIGHT = 120
export const GAME_LAYER_SCALE = 0.82

export const LAYOUT_WIDTH = SCENE_WIDTH
export const LAYOUT_HEIGHT = TOP_UI_HEIGHT + SCENE_HEIGHT * GAME_LAYER_SCALE + BOTTOM_UI_HEIGHT

export const startY = 50

// platform settings

export const PLATFORM_X = GAME_WIDTH / 2
export const PLATFORM_Y = GAME_HEIGHT - 80
export const MAX_BOUNCE_SPEED = 8

// brick settings

export const BRICK_HEIGHT = 24
export const BRICK_WIDTH = 48

// score settings

export const BRICK_SCORE = 100
export const STAGE_CLEAR_SCORE = 1000

// player settings

export const INITIAL_LIVES = 3

// power up settings

export const POWER_UP_TABLE: { type: PowerUpType; weight: number }[] = [
    { type: 'threeBall', weight: 30 },
    { type: 'extend', weight: 25 },
    { type: 'fast', weight: 20 },
    { type: 'slow', weight: 15 },
    { type: 'tiny', weight: 10 },
]

export const POWER_UP_FRAMES: Record<PowerUpType, string[]> = {
    threeBall: [
        'pup3ball_0.png',
        'pup3ball_1.png',
        'pup3ball_2.png',
        'pup3ball_3.png',
        'pup3ball_4.png',
        'pup3ball_5.png',
    ],
    extend: [
        'pupextend_0.png',
        'pupextend_1.png',
        'pupextend_2.png',
        'pupextend_3.png',
        'pupextend_4.png',
        'pupextend_5.png',
    ],
    tiny: [
        'pdowntiny_0.png',
        'pdowntiny_1.png',
        'pdowntiny_2.png',
        'pdowntiny_3.png',
        'pdowntiny_4.png',
        'pdowntiny_5.png',
    ],
    slow: [
        'pdownslow_0.png',
        'pdownslow_1.png',
        'pdownslow_2.png',
        'pdownslow_3.png',
        'pdownslow_4.png',
        'pdownslow_5.png',
    ],
    fast: [
        'pupfast_0.png',
        'pupfast_1.png',
        'pupfast_2.png',
        'pupfast_3.png',
        'pupfast_4.png',
        'pupfast_5.png',
    ],
}
// levels

export const levels = [
    [
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    [
        [1, 0, 1, 1, 0, 1],
        [1, 1, 0, 0, 1, 1],
        [0, 1, 1, 1, 1, 0],
        [1, 0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1, 1],
    ],
    [
        [0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1],
        [0, 0, 1, 1, 0, 0],
    ],
]