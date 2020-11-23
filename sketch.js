var PLAY = 1;
var END = 0;
var gameState = PLAY;

var baby,baby_crying,baby_running
var lego,legosGroup,legoImage;
var ground,groundImage, invisibleGround, backgroundImage;

var legosGroup

var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  baby_running =   loadAnimation("baby.jpg");
  baby_crying = loadAnimation("baby_crying.jpg");
  
  groundImage = loadImage("ground2.png");
  
  lego = loadImage("lego.png");
  
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  baby = createSprite(50,180,20,50);
  
  baby.addAnimation("running",baby_running);
  baby.addAnimation("collided",baby_crying);
  baby.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  legosGroup = new Group();
  
  score = 0;
}

function draw() {
  //baby.debug = true;
  background(background.jpg);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && baby.y >= 159) {
      baby.velocityY = -12;
    }
  
    baby.velocityY = baby.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    baby.collide(invisibleGround);
    spawnlegos();
  
    if(legosGroup.isTouching(baby)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    baby.velocityY = 0;
    legosGroup.setVelocityXEach(0);
    
    
    //change the babys animation
    baby.changeAnimation("collided",baby_crying);
    
    //set lifetime of the game objects so that they are never destroyed
    legosGroup.setLifetimeEach(-1);
   
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  drawSprites();
}

function spawnlegos() {
  if(frameCount % 60 === 0) {
    var lego = createSprite(600,165,10,40);
    //legos.debug = true;
    lego.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: lego.addImage(lego.png);
              break;
    }
    //assign scale and lifetime to the legos           
    lego.scale = 0.5;
    lego.lifetime = 300;
    //add each obstacle to the group
    legosGroup.add(lego);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  legosGroup.destroyEach();
 
  
  baby.changeAnimation("running",baby_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}