const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// --- 1. 遊戲資料設定 ---
let gameState = "map"; // 'map' 或 'dialog'

// 玩家座標
let worldX = 100;
let worldY = 100;

// NPC 座標
const npcWorldX = 250;
const npcWorldY = 150;

// 道具資料
let items = [
  { id: 1, x: 100, y: 330, width: 50, height: 50, color: "orange", isDragging: false },
  { id: 2, x: 200, y: 330, width: 50, height: 50, color: "green", isDragging: false }
];
let offsetX, offsetY;

// --- 2. 繪製主流程 ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (gameState === "map") {
    drawMap();
  } else if (gameState === "dialog") {
    drawDialogScreen();
  }
}

// 繪製地圖模式
function drawMap() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // 畫 NPC (紅色方塊)
  ctx.fillStyle = "red";
  const npcScreenX = npcWorldX - worldX + centerX;
  const npcScreenY = npcWorldY - worldY + centerY;
  ctx.fillRect(npcScreenX, npcScreenY, 30, 30);
  ctx.fillStyle = "black";
  ctx.fillText("NPC (滑鼠點擊/手機觸碰對話)", npcScreenX - 50, npcScreenY - 10);

  // 畫玩家 (藍色方塊)
  ctx.fillStyle = "blue";
  ctx.fillRect(centerX, centerY, 30, 30);
}

// 繪製對話與拖曳模式
function drawDialogScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 諾亞半身像區域
  ctx.fillStyle = "#FFCCCC";
  ctx.fillRect(50, 50, 150, 200); 
  ctx.fillStyle = "white";
  ctx.fillText("諾亞", 110, 150);

  // 需求格
  for(let i=0; i<3; i++) {
    ctx.strokeStyle = "white";
    ctx.strokeRect(300 + (i * 70), 50, 60, 60);
  }

  // 背包區域
  ctx.fillStyle = "#444";
  ctx.fillRect(50, 300, 700, 120);

  // 畫出道具
  items.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.fillRect(item.x, item.y, item.width, item.height);
  });

  ctx.fillStyle = "white";
  ctx.fillText("按 ESC 鍵回到地圖", 10, 20);
}

// --- 3. 控制邏輯 ---

// A. 鍵盤控制 (上下左右)
document.addEventListener("keydown", function(e) {
  if (gameState === "map") {
    if (e.key === "ArrowUp")    worldY -= 10;
    if (e.key === "ArrowDown")  worldY += 10;
    if (e.key === "ArrowLeft")  worldX -= 10;
    if (e.key === "ArrowRight") worldX += 10;
  } else if (gameState === "dialog") {
    if (e.key === "Escape") gameState = "map";
  }
  draw();
});

// B. 滑鼠/觸控 點擊判定 (觸發對話 + 開始拖曳)
canvas.addEventListener("mousedown", function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (gameState === "map") {
    // 檢查是否點到 NPC
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const npcScreenX = npcWorldX - worldX + centerX;
    const npcScreenY = npcWorldY - worldY + centerY;

    // 判斷點擊範圍是否在 NPC 內
    if (mouseX > npcScreenX && mouseX < npcScreenX + 30 &&
        mouseY > npcScreenY && mouseY < npcScreenY + 30) {
      gameState = "dialog";
    }
  } 
  else if (gameState === "dialog") {
    // 檢查是否點到道具
    items.forEach(item => {
      if (mouseX > item.x && mouseX < item.x + item.width &&
          mouseY > item.y && mouseY < item.y + item.height) {
        item.isDragging = true;
        offsetX = mouseX - item.x;
        offsetY = mouseY - item.y;
      }
    });
  }
  draw();
});

// C. 滑鼠移動 (拖曳道具)
canvas.addEventListener("mousemove", function(e) {
  if (gameState !== "dialog") return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  items.forEach(item => {
    if (item.isDragging) {
      item.x = mouseX - offsetX;
      item.y = mouseY - offsetY;
      draw();
    }
  });
});

// D. 滑鼠放開 (停止拖曳)
canvas.addEventListener("mouseup", function() {
  items.forEach(item => item.isDragging = false);
});

// 啟動繪製
draw();