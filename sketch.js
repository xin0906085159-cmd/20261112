// 宣告全域變數
let spriteStop;       // 停止時的圖片精靈
let spriteWalk;       // 移動時的圖片精靈

let stopFrames = [];  // 停止時的影格陣列 (共 10 張)
let walkFrames = [];  // 移動時的影格陣列 (共 9 張)

let totalStopFrames = 10;
let totalWalkFrames = 9;

let currentFrame = 0;
let frameDelay = 6;   // 動畫播放速度
let frameCounter = 0;

// 角色狀態與位置變數
let posX;             // 角色當前 X 座標
let isMoving = false; // 是否正在移動
let direction = 1;    // 1 代表面向右側，-1 代表面向左側

function preload() {
  // 載入兩種狀態的圖片精靈檔案
  spriteStop = loadImage('1/stop/stop.png');
  spriteWalk = loadImage('1/walk/walk.png');
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 初始化角色位置在畫面 2/3 處
  posX = (width * 2) / 3;

  // 切割停止狀態的圖片精靈 (寬 1385, 高 212, 10張)
  let stopFW = spriteStop.width / totalStopFrames;
  let stopFH = spriteStop.height;
  for (let i = 0; i < totalStopFrames; i++) {
    let img = spriteStop.get(i * stopFW, 0, stopFW, stopFH);
    stopFrames.push(img);
  }

  // 切割移動狀態的圖片精靈 (寬 1246, 高 198, 9張)
  let walkFW = spriteWalk.width / totalWalkFrames;
  let walkFH = spriteWalk.height;
  for (let i = 0; i < totalWalkFrames; i++) {
    let img = spriteWalk.get(i * walkFW, 0, walkFW, walkFH);
    walkFrames.push(img);
  }
}

function draw() {
  // 設定天空色背景
  background(135, 206, 235);

  // 計算角色高度為畫面 1/3，並按原圖比例計算寬度
  let targetHeight = height / 3;
  let targetWidth;

  if (isMoving) {
    let walkAspect = (spriteWalk.width / totalWalkFrames) / spriteWalk.height;
    targetWidth = targetHeight * walkAspect;
  } else {
    let stopAspect = (spriteStop.width / totalStopFrames) / spriteStop.height;
    targetWidth = targetHeight * stopAspect;
  }

  // 處理鍵盤持續按下的移動邏輯與邊界檢查
  if (keyIsDown(RIGHT_ARROW)) {
    isMoving = true;
    direction = 1; // 設為向右
    posX += 5;     // 移動速度
    // 限制不能超過畫布最右端
    if (posX > width - targetWidth) {
      posX = width - targetWidth;
    }
  } else if (keyIsDown(LEFT_ARROW)) {
    isMoving = true;
    direction = -1; // 設為向左
    posX -= 5;      // 移動速度
    // 限制不能超過畫布最左端
    if (posX < 0) {
      posX = 0;
    }
  } else {
    isMoving = false; // 沒有按左右鍵時停止移動
  }

  // 角色最底端的 y 軸座標落在畫布最底端
  let y = height - targetHeight;

  // 繪製角色（支援左右鏡頭翻轉與動畫影格播放）
  push();
  if (direction === -1) {
    // 透過水平翻轉來達成角色轉向
    translate(posX + targetWidth, y);
    scale(-1, 1);
    image(isMoving ? walkFrames[currentFrame] : stopFrames[currentFrame], 0, 0, targetWidth, targetHeight);
  } else {
    translate(posX, y);
    image(isMoving ? walkFrames[currentFrame] : stopFrames[currentFrame], 0, 0, targetWidth, targetHeight);
  }
  pop();

  // 控制動畫影格播放速度與對應張數循環
  frameCounter++;
  if (frameCounter >= frameDelay) {
    if (isMoving) {
      currentFrame = (currentFrame + 1) % totalWalkFrames;
    } else {
      currentFrame = (currentFrame + 1) % totalStopFrames;
    }
    frameCounter = 0;
  }
}

function windowResized() {
  // 視窗大小改變時保持全螢幕
  resizeCanvas(windowWidth, windowHeight);
}