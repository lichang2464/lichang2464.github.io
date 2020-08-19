const color_bg = 0x1099bb;
const color_inline = 0xffd900;
const color_line = 0x3A5FCD;
const _width = (window.innerWidth >= (window.innerHeight / 2) ? window.innerHeight / 2 : window.innerWidth);
const circle1 = { x: _width / 2, y: _width / 2, r: _width * 18 / 24 / 2 }
const circle2 = { x: _width / 2, y: _width / 2, r: _width * 18 / 24 / 2 - 30 }
const rectangle1 = { x: _width / 6, y: _width / 6 + _width, width: _width * 4 / 6, height: _width * 4 / 6 }
const rectangle2 = { x: _width / 6 + 30, y: _width / 6 + _width + 30, width: _width * 4 / 6 - 60, height: _width * 4 / 6 - 60 }
const option = {
    width: window.innerWidth,
    height: window.innerHeight - 4,
    backgroundColor: color_bg,
    transparent: true,
    antialias: true,
    resolution: 1
}
let color1 = 0xffffff;
let is_mousedown = 0;
let ongoingTouches = new Array();
let mouse_x;
let mouse_y;
let sprites = {
        graphics_bg: '',
        graphics: '',
        stripe: '',
        refresh: '',
        graphics_line: ''
    } //顺序

const app = new PIXI.Application(option);
const stage = new PIXI.Container();
app.stage.interactive = true;
document.body.appendChild(app.view);

const loader = PIXI.Loader.shared;

loader.add('stripe', '../image/stripe.jpg')
    .add('refresh', '../svg/refresh-cw-white.svg');
// loader.pre(cachingMiddleware);
// loader.use(parsingMiddleware);
loader.load((loader, resources) => {
    sprites.stripe = new PIXI.TilingSprite(resources.stripe.texture, window.innerWidth, 2);
    sprites.refresh = new PIXI.Sprite(resources.refresh.texture);
    sprites.stripe.x = 0;
    sprites.stripe.y = 0;
    sprites.refresh.buttonMode = true;
    sprites.refresh.interactive = true;
    sprites.refresh.x = _width - 36;
    sprites.refresh.y = 12;
    sprites.refresh.on('click', setup)
        .on('tap', setup);
    app.ticker.add(delta => gameLoop(delta));
    //设置事件处理程序
    document.addEventListener("mousedown", handleMousedown, false);
    document.addEventListener("mousemove", handleMousemove, false);
    document.addEventListener("mouseup", handleMouseup, false);
    document.addEventListener("touchstart", handleStart, false);
    document.addEventListener("touchend", handleEnd, false);
    document.addEventListener("touchmove", handleMove, false);
});

loader.onProgress.add(() => { console.log('onProgress'); }); // called once per loaded/errored file
loader.onError.add(() => { console.log('onError'); }); // called once per errored file
loader.onLoad.add(() => { console.log('onLoad'); }); // called once per loaded file
loader.onComplete.add(() => {
    console.log('onComplete');
    setup();
}); // called once when the queued resources all load.

const setup = () => {
    sprites.graphics = new PIXI.Graphics();
    sprites.graphics_bg = new PIXI.Graphics();
    sprites.graphics_line = new PIXI.Graphics();
    sprites.graphics.lineStyle(0);
    sprites.graphics.drawCircle2 = (circle) => { sprites.graphics.drawCircle(circle.x, circle.y, circle.r); }
    sprites.graphics.drawRect2 = (rectangle) => { sprites.graphics.drawRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height); }

    sprites.graphics.beginFill(color_inline);
    sprites.graphics.drawCircle2(circle1);
    sprites.graphics.drawRect2(rectangle1);
    sprites.graphics.beginFill(color_bg);
    sprites.graphics.drawCircle2(circle2);
    sprites.graphics.drawRect2(rectangle2);
    sprites.graphics_bg.beginFill(color_bg);
    sprites.graphics_bg.drawRect(0, 0, window.innerWidth, window.innerHeight);

    Object.keys(sprites).forEach(function(key) {
        app.stage.addChild(sprites[key]);
    });
}
const gameLoop = (delta) => {
    sprites.stripe.tilePosition.x += -1;
}

const handleMousedown = (evt) => {
    is_mousedown = 1;
    mouse_x = evt.clientX;
    mouse_y = evt.clientY;
    sprites.graphics_line.beginFill();
    sprites.graphics_line.lineStyle(5, color_line);
}
const handleMousemove = (evt) => {
    evt.preventDefault();
    if (is_mousedown) {
        sprites.graphics_line.moveTo(mouse_x, mouse_y);
        sprites.graphics_line.lineTo(evt.clientX, evt.clientY);
        inline_const(evt.clientX, evt.clientY);
        mouse_x = evt.clientX;
        mouse_y = evt.clientY;
    }
}
const handleMouseup = () => {
    is_mousedown = 0;
}
const handleStart = (evt) => {
    evt.preventDefault();
    let touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        sprites.graphics_line.beginFill();
        sprites.graphics_line.lineStyle(5, color_line);
        ongoingTouches.push(copyTouch(touches[i]));
    }
}
const handleMove = (evt) => {
    evt.preventDefault();
    let touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        let idx = ongoingTouchIndexById(touches[i].identifier);
        if (idx >= 0) {
            sprites.graphics_line.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
            sprites.graphics_line.lineTo(touches[i].pageX, touches[i].pageY);
            inline_const(touches[i].pageX, touches[i].pageY)
            ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
        } else {
            console.log("can't figure out which touch to continue");
        }
    }
}
const handleEnd = (evt) => {
        evt.preventDefault();
        let touches = evt.changedTouches;
        for (let i = 0; i < touches.length; i++) {
            let idx = ongoingTouchIndexById(touches[i].identifier);
            if (idx >= 0) {
                ongoingTouches.splice(idx, 1); // remove it; we're done
            } else {
                console.log("can't figure out which touch to continue");
            }
        }
    }
    //拷贝一个触摸对象
const copyTouch = (touch) => {
        return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
    }
    //找出正在进行的触摸
const ongoingTouchIndexById = (idToFind) => {
    for (let i = 0; i < ongoingTouches.length; i++) {
        let id = ongoingTouches[i].identifier;
        if (id == idToFind) {
            return i;
        }
    }
    return -1;
}
const pointInsideCircle = (x, y, circle) => {
    if (circle.r === 0) return false;
    let dx = circle.x - x;
    let dy = circle.y - y;
    return dx * dx + dy * dy <= circle.r * circle.r;
}
const pointInsiderectangle = (x, y, rectangle) => {
    return x >= rectangle.x && x <= rectangle.x + rectangle.width && y >= rectangle.y && y <= rectangle.y + rectangle.height;
}
const inline = (x, y) => {
    if (y > _width) {
        return pointInsiderectangle(x, y, rectangle1) && !pointInsiderectangle(x, y, rectangle2)
    } else {
        return pointInsideCircle(x, y, circle1) && !pointInsideCircle(x, y, circle2)
    }
}
const inline_const = (x, y) => {
    if (!inline(x, y)) {
        if (color1 != 0x000000) {
            color1 = 0x000000;
            sprites.stripe.tint = color1;
        }
    } else if (color1 != 0xffffff) {
        color1 = 0xffffff;
        sprites.stripe.tint = color1;
    }
}