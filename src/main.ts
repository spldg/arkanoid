import * as PIXI from 'pixi.js'

const app = new PIXI.Application({
    resizeTo: window,
    backgroundColor: 0x8a8888,
    antialias: true
})

const container = document.getElementById('pixi-container')
if (!container) {
    throw new Error('container not found')
}

container.appendChild(app.view)
app.ticker.add((delta) => {

})