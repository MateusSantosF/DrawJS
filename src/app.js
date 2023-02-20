
import { WebsocketWrapper } from "./modules/websocket.js";

let canvas = document.getElementById('canvas');
export let context = canvas.getContext('2d');
let bounds = canvas.getBoundingClientRect();
canvas.width = 1024;
canvas.height = 1024;

let lastDraw = []


let colorPicker = document.getElementById('colorPicker');
let slider = document.getElementById('slider')

let userInput = document.getElementById('username')

export let username = "guess";
let isDrawing = false;

userInput.addEventListener('change', (e) => {
    username = e.target.value;
})
userInput.addEventListener('focusout', (e) => {
    username = e.target.value;
})

const draw = (e) => {

    if (isDrawing) {
        let x = getX(e);
        let y = getY(e);
        lastDraw.push({ x, y })
        if (canvas.getContext) {
            context.lineTo(x, y);
            context.stroke();
        }
    }
}


function stopDrawing() {
    isDrawing = false;
    WebsocketWrapper.send(JSON.stringify({
        username,
        path: lastDraw,
        color: context.strokeStyle,
        lineWidth: context.lineWidth
    }))
    lastDraw = [];
}

const toggleMouseDown = (e) => {
    isDrawing = !isDrawing;
    context.beginPath();
    context.moveTo(getX(e), getY(e));
}

const hexTorgb = (hex) => {
    return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
}

const toggleColor = () => {
    let rgb = hexTorgb(colorPicker.value);
    context.strokeStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}

const toggleStrokeFill = () => {
    context.lineWidth = slider.value;
}

const getX = (e) => {

    let clientX = e.clientX;

    if (!clientX) {
        clientX = e.touches[0].clientX;
    }

    let x = clientX - canvas.offsetLeft;

    x /= bounds.width;
    x *= canvas.width;

    return x;
}
const getY = (e) => {

    let clientY = e.clientY;

    if (!clientY) {
        clientY = e.touches[0].clientY;
    }

    let y = clientY - canvas.offsetTop;
    y /= bounds.height;
    y *= canvas.height;

    return y;
}

canvas.addEventListener('touchstart', toggleMouseDown)

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('touchmove', draw);

canvas.addEventListener('mousedown', toggleMouseDown);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('mouseup', stopDrawing);


colorPicker.addEventListener('change', toggleColor)
slider.addEventListener('change', toggleStrokeFill);
addEventListener("resize", (event) => {
    bounds = canvas.getBoundingClientRect();
});
addEventListener("load", function (event) {
    WebsocketWrapper.open();
});


