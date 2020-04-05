
let playing = false;

var prev = new Date().getTime();
function main() {
    window.canvas = document.getElementById('canvas');
    canvas.width = 800;
    canvas.height = 800;
    window.ctx = canvas.getContext('2d');
    window.cam = new Camera(500, 500, 0);
    window.obj = [];
    // obj.push(new Circle(100, 500, 40));
   // obj.push(new Box(400, 400, 100));
    obj.push(new Line(100, 600, 100,100));
    //obj.push(new Circle(600, 600, 40));
    canvas.addEventListener("click", (e) => {
        // console.log(e);
        cam.step();
        requestAnimationFrame(loop);
    });
    canvas.addEventListener("mousemove", (e) => {
        //    console.log(e);
        //    console.log(e.offsetX-cam.x);
        //    console.log(e.offsetY-cam.y);
        //  console.log((cam.x-e.offsetX), (cam.y -e.offsetY  ));

        cam.a = Math.atan2(cam.y - e.offsetY, cam.x - e.offsetX) * 180 / Math.PI;

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
        let tx = cam.x;
        let ty = cam.y
        for (let index = 0; index < 10; index++) {
            let d = i.distance(cam.x, cam.y);
            cam.draw(d);
            cam.x = cam.x - Math.cos(cam.a / 180 * Math.PI) * d;
            cam.y = cam.y - Math.sin(cam.a / 180 * Math.PI) * d;
            if (d > 500) {
                break;
            }
        }
        cam.x = tx;
        cam.y = ty;

        i.draw();
    }

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

function drawCircle(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

class Line {
    constructor(x, y,x1,y1) {
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
        
        if ( l2 === 0 ) {
        
            return pp0X * pp0X + pp0Y * pp0Y;
        
        }
        
        const p1p0X = this.x1 - this.x;
        const p1p0Y = this.y1 - this.y;
        
        const t = clamp( ( pp0X * p1p0X + pp0Y * p1p0Y ) / l2, 0, 1 );
      
        const ptX = this.x + t * p1p0X;
        const ptY = this.y + t * p1p0Y;
        
        const pX = x - ptX;
        const pY = y - ptY;
        
        return Math.sqrt( pX * pX + pY * pY );
        
    }
    draw = () => {
        ctx.beginPath();
        ctx.moveTo(this.x,this.y);
        ctx.lineTo(this.x1,this.y1);
        ctx.stroke();
    }
}
function clamp( val, min, max ) {

    return Math.min( Math.max( min, val ), max );
    
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
        this.a++

    }
}