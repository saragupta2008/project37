//Create variables here
var dog,dogImg,dogImg2,  database, foodS, foodStock,lastFed,fedTime,foodObj,addFood,feed;
var readState,changeState;
var bedroomImage,gardenimage,washroomImage;
function preload()
{
  //load images here
  dogImg=loadImage("images/dogImg.png");
  dogImg2=loadImage("images/dogImg1.png");

  bedroomImage=loadImage("images/Bed Room.png");
  gardenimage=loadImage("images/Garden.png");
  washroomImage=loadImage("images/Wash Room.png");
}

function setup() {
  createCanvas( 600, 500);
  database=firebase.database();
  dog=createSprite(300,300);
  dog.addImage(dogImg);
  dog.scale=0.2

  foodObj = new Food()

  foodStock = database.ref('food')
  foodStock.on("value",readStock);
  
  readState = database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  })

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood= createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  
  
  
  
}


function draw() {  
background(46, 139, 87)

foodObj.display();

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
})

  //add styles here
  


  fill(255,255,254); 
  textSize(15);

  if(lastFed>=12) {
  text("Last Feed : "+ lastFed%12 + "PM", 350,30);
   }
  else if(lastFed==0){
  text("Last Feed : 12 AM", 350, 30);
  }
  else{
  text("Last Feed: "+ lastFed + "AM", 350,30);

}

currentTime=hour();
if(currentTime==(lastFed+1)){
update("Playing"); 
foodObj.garden();
}
else if(currentTime==(lastFed+2)){ 
update("Sleeping");
foodObj.bedroom(); 
}
else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){ 
update("Bathing");
foodObj.washroom();
}
else{
update("Hungry") 
foodObj.display();
}
if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(dogImg);
}
drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    food:foodObj.getFoodStock(),
    FeedTime:hour ()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

