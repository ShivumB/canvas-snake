let canvas = document.getElementById("canvas");
let cx = document.getElementById("canvas").getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Player {
    constructor(x, y) {
        this.body = [[x, y]];
        this.dir = "R";
        this.pastDir = "R";

        this.dead = false;

        this.t = 0;
    }

    act(apple) {
                
        if(this.t++ % 25 == 0 && !this.dead) {

            this.pastDir = this.dir;

            //lengthen snake
            if(this.dir == "R") this.body.splice(0, 0, [this.body[0][0] + 1, this.body[0][1]]);
            else if(this.dir == "L") this.body.splice(0, 0, [this.body[0][0] - 1, this.body[0][1]]);
            else if(this.dir == "U") this.body.splice(0, 0, [this.body[0][0], this.body[0][1] - 1]);
            else if(this.dir == "D") this.body.splice(0, 0, [this.body[0][0], this.body[0][1] + 1]);

            //check apple collision
            if(this.body[0][0] == apple.pos[0] && this.body[0][1] == apple.pos[1]) {

                //get new pos for apple - that isn't intersecting with snake
                let pass = false;
                while(!pass) {
                    pass = true;
                    apple.pos[0] = Math.floor(17*Math.random());
                    apple.pos[1] = Math.floor(17*Math.random());

                    for(let i = 0; i < this.body.length && pass; i++) {
                        if(this.body[i][0] == apple.pos[0] && this.body[i][1] == apple.pos[1]) pass = false;
                    }
                }
            } else {
                //since no apple, delete tail
                this.body.splice(this.body.length - 1, 1);
            }

            //check self collisions
            for(let i = 1; i < this.body.length; i++)
                if(this.body[0][0] == this.body[i][0] && this.body[0][1] == this.body[i][1])
                    this.dead = true;

            //check wall collisions
            if(this.body[0][0] < 0 || this.body[0][0] >= 17) this.dead = true;
            if(this.body[0][1] < 0 || this.body[0][1] >= 17) this.dead = true;
        }

        //draw self
        cx.fillStyle = "rgb(0, 0, 0)";
        for(let i = 0; i < this.body.length; i++) {
            cx.fillRect(canvas.width/2 - 250 + this.body[i][0]*500/17, canvas.height/2 - 250 + this.body[i][1]*500/17, 500/17, 500/17);
        }
        
    }
}

class Apple {
    constructor(x, y) {
        this.pos = [x, y];
    }

    act() {
        cx.fillStyle = "rgb(255, 0, 0)";
        cx.fillRect(canvas.width/2 - 250 + this.pos[0]*500/17, canvas.height/2 - 250 + this.pos[1]*500/17, 500/17, 500/17);
    }
}

let p = new Player(8, 8);
let apple = new Apple(4, 4);


window.addEventListener("keydown", (event) => {
   if(event.code == "KeyA" && p.pastDir != "R") p.dir = "L";
   else if(event.code == "KeyD" && p.pastDir != "L") p.dir = "R";
   else if(event.code == "KeyW" && p.pastDir != "D") p.dir = "U";
   else if(event.code == "KeyS" && p.pastDir != "U") p.dir = "D";
});

let scene = "title";
cx.textAlign = "center";
cx.baseline = "center";

let mouseX = 0;
let mouseY = 0;

window.addEventListener('mousemove', function (e) {
    mouseX = e.x;
    mouseY = e.y;
});

window.addEventListener("mousedown", (event) => {
    
    if(scene == "title" || scene == "lose") {
        if(event.x > canvas.width/2 - 80 && event.x < canvas.width/2 + 80 && event.y > canvas.height/2 + 40 && event.y < canvas.height/2 + 90) {
            scene = "game";
            p.body = [[8, 8]];
            apple.pos = [4,4];
            p.dead = false;
            p.dir = "R";
            p.pastDir = "R";
        }
    }
})

function draw() {
 
    cx.fillStyle = "rgb(231,207,180)";
    cx.fillRect(0, 0, canvas.width, canvas.height);

    cx.fillStyle = "rgb(40, 150, 40)";
    cx.fillRect(canvas.width/2 - 270, canvas.height/2 - 270, 540, 540);

    for(let i = 0; i < 17; i ++) {
        for(let j = 0; j < 17; j ++) {            
            if((17 * i + j) % 2 == 0) cx.fillStyle = "rgb(140, 250, 130)";
            else cx.fillStyle = "rgb(110, 220, 100)";

            cx.fillRect(canvas.width/2 - 250 + j*500/17, canvas.height/2 - 250 + i*500/17, 500/17, 500/17);
        }
    }

    switch(scene) {

        case "title":
            cx.font = "100px Arial";
            cx.fillStyle = "rgb(0, 0, 0)";
            cx.fillText("Snake", canvas.width/2, canvas.height/2);

            if(mouseX > canvas.width/2 - 80 && mouseX < canvas.width/2 + 80 && mouseY > canvas.height/2 + 40 && mouseY < canvas.height/2 + 90) {
                cx.fillStyle = "rgba(0, 0, 0, 0.8)";
            } else {
                cx.fillStyle = "rgba(0, 0, 0, 0.6)";
            }
            cx.roundRect(canvas.width/2 - 80, canvas.height/2 + 40, 160, 50, 10);
            cx.fill();

            cx.fillStyle = "rgb(220,220,220)";
            cx.font = "25px Arial";
            cx.fillText("Play", canvas.width/2, canvas.height/2 + 40 + 30)
        break;

        case "game":
            p.act(apple);
            apple.act();
    
            if(p.dead) scene = "lose"; 

        break;

        case "lose":
            cx.font = "70px Arial";
            cx.fillStyle = "rgb(0, 0, 0)";
            cx.fillText("You Lost", canvas.width/2, canvas.height/2);

            if(mouseX > canvas.width/2 - 80 && mouseX < canvas.width/2 + 80 && mouseY > canvas.height/2 + 40 && mouseY < canvas.height/2 + 90) {
                cx.fillStyle = "rgba(0, 0, 0, 0.8)";
            } else {
                cx.fillStyle = "rgba(0, 0, 0, 0.6)";
            }
            cx.roundRect(canvas.width/2 - 80, canvas.height/2 + 40, 160, 50, 10);
            cx.fill();

            cx.fillStyle = "rgb(220,220,220)";
            cx.font = "25px Arial";
            cx.fillText("Play Again", canvas.width/2, canvas.height/2 + 40 + 30);
        break;

    }
}

setInterval(draw, 1);