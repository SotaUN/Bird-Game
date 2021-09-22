class vector{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
    set setx(value){
        this.x = value;
    }
    set sety(value){
        this.y = value;
    }
}


let canvas = document.getElementById('canvas');
let ctx;

let count = 0;
let mousex = 0;
let mousey = 0;

let n = 50;

let destination = new vector(0,0);


let bird_pos = new Array(n);

let bird_average = new vector(0,0);

$("#game_start").on("click",function(){
    //canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    game_init();
    setInterval(function(){game();},0);
});

function game_init(){
    for(let i = 0;i < n;i++){
        bird_pos[i] = new vector(0,0);
        bird_pos[i].setx = Math.random() * 700;
        bird_pos[i].sety = Math.random() * 700;
    }
    flag_hp = flag_hp_max;
    flag_remain = 0;
}


function game(){
    
    
    //document.getElementById("output_message").innerHTML = count;
    
    
    //描画
    ctx.clearRect(0,0,1400,700);

    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0,0,1400,700);
    ctx.fillStyle = "blue";
    ctx.fillRect(count%700,100,5,5);
    
    
    

    const chara = new Image();
    chara.src = "./1_red.png";  // 画像のURLを指定
    //ctx.drawImage(chara, 0, 0, 700, 700);
    bird_move();

    //ctx.globalCompositeOperation = 'darker';
    for(let i = 0;i < n;i++){
        
        
        ctx.drawImage(chara, bird_pos[i].x, bird_pos[i].y, chara.width * 0.15, chara.height * 0.15);
        //ctx.strokeRect(bird_pos[i].x,bird_pos[i].y, chara.width * 0.15, chara.height * 0.15);
    }

    flag_move();

    //ctx.globalCompositeOperation = 'source_over';

    dest_move();


    ctx.fillRect(bird_average.x,bird_average.y,10,10);

    const orima = new Image();
    orima.src = "./orima.png";
    ctx.drawImage(orima, destination.x,destination.y, 60, 60);
    //ctx.fillRect(destination.x,destination.y,20,20);
    count++;
}


function go_to_dest(bird){
    let res = new vector(destination.x - bird.x, destination.y - bird.y);
    let res_size = Math.pow(destination.x - bird.x,2) + Math.pow(destination.y - bird.y,2);
    res = unit_vector(res);

    //document.getElementById("output_message").innerHTML = Math.sqrt(res_size);
    
    res.setx = res.x * Math.sqrt(res_size) / 200;
    res.sety = res.y * Math.sqrt(res_size) / 200;
    return res;
}

function calc_average(){
    bird_average.setx = 0;
    bird_average.sety = 0;
    for(let i = 0;i < n;i++){
        bird_average.setx = bird_average.x + bird_pos[i].x;
        bird_average.sety = bird_average.y + bird_pos[i].y;
    }
    bird_average.setx = bird_average.x / n;
    bird_average.sety = bird_average.y / n;
}

let center_x_weight = 800;
let center_y_weight = 800;
function go_to_center(bird){
    let res = new vector(bird_average.x - bird.x, bird_average.y - bird.y);
    let res_size = Math.pow(bird_average.x - bird.x,2) + Math.pow(bird_average.y - bird.y,2);
    res = unit_vector(res);

    res.setx = res.x * Math.sqrt(res_size) / center_x_weight;
    res.sety = res.y * Math.sqrt(res_size) / center_y_weight;

    //document.getElementById("output_message").innerHTML = Math.sqrt(res_size);

    return res;
}
$("#default").on("click",function(){
    center_x_weight = 800, center_y_weight = 800;
});
$("#spread_y").on("click",function(){
    /*center_x_weight = 800,*/ center_y_weight = -300;
});
$("#spread_x").on("click",function(){
    center_x_weight = -300/*, center_y_weight = 800*/;
});

function take_dist(bird){
    let mind = 10000000;
    let mini = 0;
    for(let i = 0;i < n;i++){
        let nowd = Math.pow(bird_pos[i].x - bird.x,2) + Math.pow(bird_pos[i].y - bird.y,2);

        if(nowd != 0 && nowd < mind){
            mind = nowd;
            mini = i;
        }
    }

    let vec_close = new vector(bird_pos[mini].x - bird.x,bird_pos[mini].y - bird.y);
    let vec_size = Math.pow(bird_pos[mini].x - bird.x,2) + Math.pow(bird_pos[mini].y - bird.y,2);
    vec_close = unit_vector(vec_close);

    vec_close.setx = vec_close.x * 490 / vec_size, vec_close.sety = vec_close.y * 490 / vec_size;
    vec_close.setx = vec_close.x * -1, vec_close.sety = vec_close.y * -1;

    return vec_close;
}



let how_dis = 1;
let how_move = 1;
let how_center = 1;

let des_xspeed = 0;
let des_yspeed = 0;

function bird_move(){
    if(count % 300 == 0){
        //destination.setx = Math.random() * 600;
        //destination.sety = Math.random() * 600;
        //document.getElementById("output_message").innerHTML = destination.x + " " + destination.y;

    }

    calc_average();
    for(let i = 0;i < n;i++){
        let move = new vector(0,0);
        
        let move_to_dest = go_to_dest(bird_pos[i]);
        move.setx = move.x + how_move * move_to_dest.x, move.sety = move.y + how_move * move_to_dest.y;
        //document.getElementById("output_message").innerHTML = move_to_dest.x + " " + move_to_dest.y;

        let take_dists = take_dist(bird_pos[i]);
        //document.getElementById("output_message").innerHTML = take_dists.x + " " + take_dists.y;
        move.setx = move.x + how_dis * take_dists.x, move.sety = move.y + how_dis * take_dists.y;

        
        let move_to_center = go_to_center(bird_pos[i]);
        move.setx = move.x + how_center * move_to_center.x, move.sety = move.y + how_center * move_to_center.y;

        //if(i==0)document.getElementById("output_message").innerHTML = Math.pow(move.x,2) + Math.pow(move.y,2);
        if(Math.pow(move.x,2) + Math.pow(move.y,2) < 0.7)continue;

        bird_pos[i].setx = bird_pos[i].x + move.x;
        bird_pos[i].sety = bird_pos[i].y + move.y;

        //document.getElementById("output_message").innerHTML = Math.pow(bird_pos[i].x - destination.x,2) + Math.pow(bird_pos[i].y - destination.y,2);
    }
}


let up_push = false;
let down_push = false;
let right_push = false;
let left_push = false;
function dest_move(){
    if(!left_push && !right_push){
        if(des_xspeed < 0)des_xspeed += 0.02;
        else des_xspeed -= 0.02;
    }
    if(!up_push && !down_push){
        if(des_yspeed < 0)des_yspeed += 0.02;
        else des_yspeed -= 0.02;
    }

    if(Math.abs(des_xspeed) < 0.1)des_xspeed = 0;
    if(Math.abs(des_yspeed) < 0.1)des_yspeed = 0;
    destination.setx = destination.x + des_xspeed;
    destination.sety = destination.y + des_yspeed;

    //if(destination.x > 700 || destination.y > 700)alert("hello");
    //document.getElementById("output_message").innerHTML = des_xspeed + " " + des_yspeed;
}

let flag_hp = 10000;
let flag_remain = 0;
let flag_hp_max = 10000;
function flag_move(){
    const flag_img = new Image();
    flag_img.src = "./flag.png";
    ctx.drawImage(flag_img, 200, 200, flag_img.width * 0.1, flag_img.height * 0.1);

    if(count % 500 == 0){
        flag_remain = 0;
    }
    ctx.fillStyle = "black";
    ctx.strokeRect(199,199,flag_img.width * 0.1 + 2,10 + 2)
    ctx.fillStyle = "green";
    ctx.fillRect(200,200,flag_img.width * 0.1 * flag_hp / flag_hp_max,10);
    ctx.fillStyle = "red";
    ctx.fillRect(200 + flag_img.width * 0.1 * flag_hp / flag_hp_max, 200, flag_img.width * 0.1 * flag_remain / flag_hp_max, 10);

    for(let i = 0;i < n;i++){
        if(Math.pow(200 - bird_pos[i].x,2) + Math.pow(200 - bird_pos[i].y,2) < 1000)flag_hp--,flag_remain++;
        //document.getElementById("output_message").innerHTML = "a" + Math.pow(200 - bird_pos[i].x,2) + Math.pow(200 - bird_pos[i].y,2);
    }
}

function unit_vector(vec){
    let scala = vec.x * vec.x + vec.y * vec.y;
    scala = Math.sqrt(scala);

    let res = new vector(vec.x / scala,vec.y / scala);
    return res;
}


document.addEventListener('keydown', (event) => {
    //document.getElementById("output_message").innerHTML = event.key;
    event.preventDefault();
    if(event.key == "ArrowUp"){
        up_push = true;
        des_yspeed = -1;
    }
    if(event.key == "ArrowDown"){
        down_push = true;
        des_yspeed = 1;
    }
    if(event.key == "ArrowLeft"){
        left_push = true;
        des_xspeed = -1;
    }
    if(event.key == "ArrowRight"){
        right_push = true;
        des_xspeed = 1;
    }
    
});
document.addEventListener('keyup', (event) => {
    document.getElementById("output_message").innerHTML = event.key + " a";
    event.preventDefault();
    if(event.key == "ArrowUp"){
        up_push = false;
    }
    if(event.key == "ArrowDown"){
        down_push = false;
    }
    if(event.key == "ArrowLeft"){
        left_push = false;
    }
    if(event.key == "ArrowRight"){
        right_push = false;
    }
    
});
