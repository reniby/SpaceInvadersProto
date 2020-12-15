let playerX = 475;
let playerY = 475;
let xvel = 5;
let yvel = 5;

let lives = 3;
let inv = false;

let deathTime = 0;
let deathSave = [];

let shoottime = 0;
let dmgtime = -1000;

let bullet = [];
let ebullet = [];
let stars = [];

let canShoot = true;
let time = 0;

let bigguys = [];
let enemies = [];
let enemies2 = [];
let all = [bigguys, enemies, enemies2];

let cols = 6;
let jig = -1;
let ebullets = [];

let alive = 1;

function preload(){
  img = loadImage('assets/white.png');
  eimg = loadImage('assets/enemy.png');
  e2img = loadImage('assets/e2.png')
  back = loadImage('assets/stars.png');
  exp1 = loadImage('assets/exp1.png');
  alien = loadImage('assets/alien1-2.png');
  
  heart = loadImage('assets/heart.png');
  dmg = loadImage('assets/dmgflash.png');
  
  b1 = loadImage('assets/bulletnote1.png');
  b2 = loadImage('assets/bulletnote2.png');
  b3 = loadImage('assets/bulletnote3.png');
  b4 = loadImage('assets/bulletnote4.png');
}

function setup() {
  createCanvas(800, 800);
  
  for (let i = 0; i < cols; i++){
    bigguys.push(72 + 70*i, 45);
    enemies.push(75 + 70*i, 100);
    enemies.push(75 + 70*i, 150);
    enemies2.push(88 + 70*i, 190);
    enemies2.push(88 + 70*i, 240);
  }
  
  for (let i = 0; i < 90; i++){
    let temp;
    if (random(12) < 1)
      temp = 0;
    else
      temp = 1;
    stars.push(int(random(800)), int(random(800)), temp);
  }  
}

function draw() {
  background(0);
  
  for (let i = 0; i < stars.length; i+=3){
    if (stars[i+2] == 0)
      fill('#B57D30');
    else
      fill('white');
    circle(stars[i], stars[i+1], ceil(i/30)*0.5);
    stars[i+1] += (ceil(i/30)/2.75);
    if (stars[i+1] > 800) {
      stars[i+1] -= 800;
      stars[i] = int(random(800));
    }    
  }
  
  if (keyIsDown(68) && alive == 1)  {
    if (playerX < 750)
      playerX += xvel;
  }
  if (keyIsDown(65) && alive == 1)  {
    if (playerX > 0)
      playerX -= xvel;
  }
  if (keyIsDown(87) && alive == 1)  {
    if (playerY > 0)
      playerY -= yvel;
  }
  if (keyIsDown(83) && alive == 1)  {
    if (playerY < 750)
      playerY += yvel;
  }
  
  if ((keyIsDown(37) || keyIsDown(38) || keyIsDown(39) || keyIsDown(40) || keyIsDown(32)) && canShoot == true){
    canShoot = false;
    if (keyIsDown(37))
      shoot(-1, 0);
    if(keyIsDown(38) || keyIsDown(32))
      shoot(0, -1);
    if(keyIsDown(39))
      shoot(1, 0);
    if (keyIsDown(40))
      shoot(0, 1);
    time = millis();
  }
  
  
  bfill(bullet);
  bfill(ebullet);
  
  //print(ebullet);
  
  //itai the three below call drawEnemy, good ex
  if (alive > 0) {
    drawEnemy(enemies, eimg);
    drawEnemy(enemies2, e2img);
    drawEnemy(bigguys, alien);
  }
  
  drawPlayer();
  
  
  textSize(50);
  fill('red');
  if (enemies.length == 0 && enemies2.length == 0 && bigguys.length == 0)
    text("You Win!", 300, 400);
  
  
  //hi emma
  moveEnemy(enemies);
  moveEnemy(enemies2);
  moveEnemy(bigguys);
  
  if(millis() - deathTime < 100 && deathTime != 0)
    death(deathSave[0], deathSave[1]);
  else if(millis() - deathTime < 100)
    deathTime = 0;
  timer();
  
  
  //enemy shooting
  if (alive > 0) {
    if (millis() - shoottime > 1000) {
      shoottime = millis();
      let type = int(random(3));
      let r = ((all[type].length / 2));
      let shooter = int(random(r))*2;
      eshoot(all[type][shooter], all[type][shooter+1], 0, 1);
    }
  }
  
  if (lives == 0)
    lose();
  
  for (let h = 0; h < lives; h++){
    image(heart, 5 + 32*h, 770);  
  }

}

function mouseClicked() {
  
  if (canShoot == true){
    canShoot = false;
    if (mouseX > playerX && mouseY > playerY){  //Q1
       if (abs(mouseX-playerX) > abs(mouseY-playerY))
         shoot(1, 0);
        else
          shoot(0, 1);
    }
    else if (mouseX < playerX && mouseY > playerY){ //Q2
       if (abs(mouseX-playerX) > abs(mouseY-playerY))
         shoot(-1, 0);
        else
          shoot(0, 1);      
    }
    else if (mouseX < playerX && mouseY < playerY){ //Q3
       if (abs(mouseX-playerX) > abs(mouseY-playerY))
         shoot(-1, 0);
        else
          shoot(0, -1);      
    }
    else if (mouseX > playerX && mouseY < playerY){ //Q2
       if (abs(mouseX-playerX) > abs(mouseY-playerY))
         shoot(1, 0);
        else
          shoot(0, -1);      
    }
    time = millis();
  }
}

function shoot(x, y) {
  if (alive == 1) {
    let temp = int(random(4));
    bullet.push(playerX+20, playerY, x, y, temp);
  }
}

function eshoot(ex, ey, x, y) {
  let temp = int(random(4));
  ebullet.push(ex+20, ey, x, y, temp);
}

function timer() {
  let curr = millis();
  if (curr - time > 500)
    canShoot = true;
}

function death(x, y) {
  image(exp1, x, y); 
}

function moveEnemy(m) {
  if (alive > 0){
    for (let j = 0; j< m.length; j+=2){
      if (m[m.length-2] >= 750)
        jig = -1;
      else if (m[0] <= 0)
        jig = 1;
      m[j] += jig;
    }
  }
}

function bfill(btype) {
  for (let i = 0; i < btype.length; i += 5) {
    let temp = btype[i+4]+1;
    if (temp == 1){
      image(b1, btype[i], btype[i+1]);  
      b1.resize(12, 0);
    }
    else if (temp == 2) {
      image(b2, btype[i], btype[i+1]);  
      b2.resize(12, 0);
    }
    else if (temp == 3) {
      image(b3, btype[i], btype[i+1]);  
      b3.resize(12, 0);
    }
    else if (temp == 4) {
      image(b4, btype[i], btype[i+1]);  
      b4.resize(12, 0);
    }
    btype[i] += 10*btype[i+2];
    btype[i+1] += 10*btype[i+3];
    if (btype[i+1] < 0)
      btype.splice(i, 5);
    else if (btype[i+1] > 800)
      btype.splice(i, 5);
    else if (btype[i] < 0)
      btype.splice(i, 5);
    else if (btype[i] > 800)
      btype.splice(i, 5);
  }
}


function drawEnemy(e, sprite) {
  for (let j = 0; j < e.length; j+=2){
    image(sprite, e[j], e[j+1]);   
    for (let i = 0; i < bullet.length; i+=5){
      if (bullet[i] >= e[j]-10 && bullet[i]+10 <= e[j]+30+15 && bullet[i+1] > e[j+1]-30-10 && bullet[i+1]-10 < e[j+1]+10) {
        deathTime = millis();
        deathSave = [e[j], e[j+1]];
        death(e[j], e[j+1]); 
        e.splice(j, 2);
        bullet.splice(i, 5);
      }
    }
  }
}

function drawPlayer(e, sprite) {
  if (((millis() - dmgtime < 100 || millis() - dmgtime > 200 && millis() - dmgtime < 300 || millis() - dmgtime > 400 && millis() - dmgtime < 500) && lives >= 1) || lives == 0) {
    image(dmg, playerX, playerY);
    inv = true;
  }
  else {
    image(img, playerX, playerY);
    inv = false;
  }
  img.resize(55, 0);
  dmg.resize(55, 0);
  
  for (let i = 0; i < ebullet.length; i+=5){
      if (ebullet[i] >= playerX-10 && ebullet[i]+10 <= playerX+30+15 && ebullet[i+1] > playerY-30-10 && ebullet[i+1]-10 < playerY+10 && inv == false) {
        ebullet.splice(i, 5);
        lives--;
        dmgtime = millis();
      }
    }
}

function lose(){
  alive = 0;
  text("You Lose!", 300, 400);
}