
let playing = false;

var prev = new Date().getTime();
function main() {
    window.canvas = document.getElementById('canvas');
    canvas.width = 1800;
    canvas.height = 1800;
    window.ctx = canvas.getContext('2d');
    window.cam = new Camera(800, 800, 0);
    window.obj = [];
    window.pux = [];
    window.lines = [];
    // obj.push(new Plus(100, 500, 40));
    obj.push(new Circle(600, 500, 40));
    obj.push(new Box(300, 700, 100));
   obj.push(new Line(0, 1800, 1500, 0));
    obj.push(new Triangle(100, 800, 100, 100, 200, 400));
    obj.push(new Circle(600, 600, 40));
    canvas.addEventListener("click", (e) => {
        // console.log(e);
      //  cam.step();
       // requestAnimationFrame(loop);
    });
    document.addEventListener("keydown", (e) => {
         
        switch (e.code) {
            case "KeyW":
                cam.up();
                break;
                case "KeyS":
                    cam.down();
                    break;
                    case "KeyD":
                cam.right();
                break;
                case "KeyA":
                cam.left();
                break;
            default:
                break;
        }
      
    });
    document.addEventListener("keyup", (e) => {  requestAnimationFrame(loop);});
    canvas.addEventListener("mousemove", (e) => {
        //    console.log(e);
        //    console.log(e.offsetX-cam.x);
        //    console.log(e.offsetY-cam.y);
        //  console.log((cam.x-e.offsetX), (cam.y -e.offsetY  ));

        cam.a = (Math.atan2(cam.y - e.offsetY, cam.x - e.offsetX) * 180 / Math.PI)-30;

       requestAnimationFrame(loop);
    });
}

function loop(time) {



    draw();
    update();


}

function draw() {
    // let data = render(width,height);
    //  context.putImageData(new ImageData(data, width, height), 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const i of obj) {
        //    i.draw();

    }
    let ta = cam.a;
    
    for (let x = 0; x < 60; x++) {
        cam.step();
        let tx = cam.x;
        let ty = cam.y
        let totalDist = 0;
        for (var index = 0; index < 1000; index++) {
            let arr = [];
            for (const i of obj) {
                arr.push(i.distance(cam.x, cam.y));
            }
            var d = Math.min.apply(Math, arr);

            cam.draw(d);
            cam.x = cam.x - Math.cos(cam.a / 180 * Math.PI) * d;
            cam.y = cam.y - Math.sin(cam.a / 180 * Math.PI) * d;
            if (d > 1000) {
                break;
            }
            if (d < 1e-1) {

                break;

            }
            totalDist += d;

        }

        let gray = 1 - (index)/ 100;
        //console.log(gray);
        pux.push([cam.x, cam.y, gray]);

        cam.x = tx;
        cam.y = ty;
        lines.push(gray);
    }

    cam.a = ta;

    for (const i of pux) {
        drawPix(i[0], i[1], { "r": 255 * i[2], "g": 0 * i[2], "b": 0 * i[2] });

    }
    for (let i = 0; i < lines.length; i++) {
        
        
    let h = 500*lines[i];
        drawBox(i*15,(1000+300)-(h/2),15,h,{ "r": 120*lines[i] , "g": 90*lines[i] , "b": 40 *lines[i] }); //800 = 500

    }
    lines = [];
    if (playing) {
        requestAnimationFrame(loop);
    }
}

function update(dt) {

    let time = new Date().getTime();
    // console.log(time - prev);
    prev = time;




}

requestAnimationFrame(loop);


function render(width, height) {
    let data = new Uint8ClampedArray(4 * width * height);
    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {


        }

    }
    return data;
}

function Get2DDistance() {

}
function drawPix(x, y, color) {
    ctx.beginPath();

    ctx.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.fillRect(x, y, 2, 2);
    ctx.stroke();
}
function drawBox(x, y,x1, y1, color) {
    ctx.beginPath();

    ctx.fillStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.fillRect(x, y, x1, y1);
    ctx.stroke();
}
function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2,color = { "r": 255 , "g": 80 , "b": 80 } ) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

class Line {
    constructor(x, y, x1, y1) {
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
    }
    distance = (x, y) => {

        const p0p1X = this.x - this.x1;
        const p0p1Y = this.y - this.y1;

        const l2 = p0p1X * p0p1X + p0p1Y * p0p1Y;

        const pp0X = x - this.x;
        const pp0Y = y - this.y;

        if (l2 === 0) {

            return pp0X * pp0X + pp0Y * pp0Y;

        }

        const p1p0X = this.x1 - this.x;
        const p1p0Y = this.y1 - this.y;

        const t = clamp((pp0X * p1p0X + pp0Y * p1p0Y) / l2, 0, 1);

        const ptX = this.x + t * p1p0X;
        const ptY = this.y + t * p1p0Y;

        const pX = x - ptX;
        const pY = y - ptY;

        return Math.sqrt(pX * pX + pY * pY);

    }
    draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
    }
}
class Triangle {
    constructor(x1, y1, x2, y2, x3, y3) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;

    }
    distance = (x, y) => {
        const centerX = (this.x1 + this.x2 + this.x3) / 3;
        const centerY = (this.y1 + this.y2 + this.y3) / 3;

        const cpX = centerX - x;
        const cpY = centerY - y;

        const edge0X = this.x2 - this.x1;
        const edge0Y = this.y2 - this.y1;
        const edge1X = this.x3 - this.x2;
        const edge1Y = this.y3 - this.y2;
        const edge2X = this.x1 - this.x3;
        const edge2Y = this.y1 - this.y3;

        const denominator0 = edge0Y * cpX - edge0X * cpY;
        const denominator1 = edge1Y * cpX - edge1X * cpY;
        const denominator2 = edge2Y * cpX - edge2X * cpY;

        if (denominator0 === 0 || denominator1 === 0 || denominator2 === 0) {

            return 0;

        }

        const pP0X = x - this.x1;
        const pP0Y = y - this.y1;
        const pP1X = x - this.x2;
        const pP1Y = y - this.y2;
        const pP2X = x - this.x3;
        const pP2Y = y - this.y3;

        const ua0 = (edge0X * pP0Y - edge0Y * pP0X) / denominator0;
        const ub0 = (cpX * pP0Y - cpY * pP0X) / denominator0;
        const ua1 = (edge1X * pP1Y - edge1Y * pP1X) / denominator1;
        const ub1 = (cpX * pP1Y - cpY * pP1X) / denominator1;
        const ua2 = (edge2X * pP2Y - edge2Y * pP2X) / denominator2;
        const ub2 = (cpX * pP2Y - cpY * pP2X) / denominator2;

        if (ua0 >= 0 && ua0 <= 1 && ub0 >= 0 && ub0 <= 1) {

            return this.distanceToLine(x, y, this.x1, this.y1, this.x2, this.y2);

        } else if (ua1 >= 0 && ua1 <= 1 && ub1 >= 0 && ub1 <= 1) {

            return this.distanceToLine(x, y, this.x2, this.y2, this.x3, this.y3);

        } else if (ua2 >= 0 && ua2 <= 1 && ub2 >= 0 && ub2 <= 1) {

            return this.distanceToLine(x, y, this.x3, this.y3, this.x1, this.y1);

        } else {

            return 0;

        }

        return this.distanceToLine(x, y, this.x1, this.y1, this.x2, this.y2);
    }
    distanceToLine = (x, y, x1, y1, x2, y2) => {

        const p0p1X = x2 - x1;
        const p0p1Y = y2 - y1;

        const l2 = p0p1X * p0p1X + p0p1Y * p0p1Y;

        const pp0X = x - x2;
        const pp0Y = y - y2;

        if (l2 === 0) {

            return pp0X * pp0X + pp0Y * pp0Y;

        }

        const p1p0X = x1 - x2;
        const p1p0Y = y1 - y2;

        const t = clamp((pp0X * p1p0X + pp0Y * p1p0Y) / l2, 0, 1);

        const ptX = x2 + t * p1p0X;
        const ptY = y2 + t * p1p0Y;

        const pX = x - ptX;
        const pY = y - ptY;

        return Math.sqrt(pX * pX + pY * pY);

    }
    draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.lineTo(this.x3, this.y3);
        ctx.lineTo(this.x1, this.y1);
        ctx.stroke();
    }
}
function clamp(val, min, max) {

    return Math.min(Math.max(min, val), max);

}
class Sin {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;

    }
    distance = (x, y) => {
        // return Math.max(Math.abs(x),Math.abs(y))-1;
        // return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) - 10;
        return 8;
    }
    draw = () => {
        // ctx.beginPath();
        //ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        // ctx.stroke();
    }
}
class Plus {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;

    }
    distance = (x, y) => {
        // ( in vec2 p, in float w, in float r )

        let px = Math.abs(x);
        let py = Math.abs(y);
        //  return length(p-Math.min(px+py,4)*0.5) - 10;
        return Math.sqrt(x ** 2 + y ** 2 - 100) - 1;

    }
    draw = () => {
        // ctx.beginPath();
        //ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        // ctx.stroke();
    }
}
class Circle {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    distance = (x, y) => {


        return Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2) - this.r;
    }
    draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        ctx.stroke();
    }
}
class Box {
    constructor(x, y, s) {
        this.x = x;
        this.y = y;
        this.s = s;

    }
    distance = (x, y) => {






        const offsetX = Math.abs(x - this.x) - this.s / 2;
        const offsetY = Math.abs(y - this.y) - this.s / 2;

        const offsetMaxX = Math.max(offsetX, 0);
        const offsetMaxY = Math.max(offsetY, 0);
        const offsetMinX = Math.min(offsetX, 0);
        const offsetMinY = Math.min(offsetY, 0);

        const unsignedDst = Math.sqrt(offsetMaxX * offsetMaxX + offsetMaxY * offsetMaxY);
        const dstInsideBox = Math.max(offsetMinX, offsetMinY);

        return unsignedDst + dstInsideBox;




    }
    draw = () => {
        ctx.beginPath();
        ctx.rect(this.x - this.s / 2, this.y - this.s / 2, this.s, this.s);
        ctx.stroke();
    }
}

class Camera {
    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.spx = x;
        this.spy = y;
    }
    draw = (distance) => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.round(distance), 0, Math.PI * 2, true);
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - Math.cos(this.a / 180 * Math.PI) * distance, this.y - Math.sin(this.a / 180 * Math.PI) * distance);
        ctx.stroke();
    }
    step = () => {
        
        if(this.a >=360){this.a=0;}
        this.a++
    }
    up = ()=>{
        this.y--;
    }
    down = ()=>{
        this.y++;
    }
    right = ()=>{
        this.x++;
    }
    left = ()=>{
        this.x--;
    }
}