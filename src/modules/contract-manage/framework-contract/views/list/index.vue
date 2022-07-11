<template>
  <div
    id="canvasDom"
    width="1000"
    height="1000"
  ></div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';

// 绘制框和文字
const draw = (
  text: string,
  textX: number,
  textY: number,
  x: number,
  y: number,
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')!;
    ctx.font = '14px bold 黑体';
    ctx.fillStyle = 'black';
    ctx.fillText(text, textX, y + textY);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, width, height);
  }
};

// 绘制圆和序号
const drawCircular = (
  text: string,
  x: number,
  y: number,
  textX: number,
  textY: number,
  canvas: HTMLCanvasElement,
) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')!;
    // 画圆
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = '#2878ff';
    ctx.fill();

    // 填字
    ctx.fillStyle = 'white';
    ctx.font = '16px bold 黑体';
    ctx.fillText(text, textX, textY);
  }
};

// 绘制虚线
const drawDashedLine = (x: number, y: number, moveX: number, moveY: number, canvas: HTMLCanvasElement) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = 'red';
    ctx.setLineDash([5, 10]);
    ctx.beginPath(); // 新建一条path
    ctx.moveTo(x, y); // 把画笔移动到指定的坐标
    ctx.lineTo(x + moveX, y + moveY); // 绘制一条从当前位置到指定坐标(200, 50)的直线.
    ctx.stroke(); // 绘制路径。
  }
};

// 绘制小方块
const drawRect = (x: number, y: number, canvas: HTMLCanvasElement) => {
  if (canvas.getContext) {
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, 6, 6);
  }
};

onMounted(() => {
  const canvasDom = document.getElementById('canvasDom')!;
  const canvas = document.createElement('canvas');
  canvas.width = 1000;
  canvas.height = 1000;
  canvasDom.appendChild(canvas);
  draw('crm确认合同框架+签署位置', 150, 25, 50, 100, 400, 40, canvas);
  drawCircular('1', 50, 100, 45, 105, canvas);
  draw('客户端发起签署', 480, 25, 400, 200, 250, 40, canvas);
  drawCircular('2', 400, 200, 395, 205, canvas);
  draw('crm生成合同编号+补充订单明细', 150, 25, 50, 300, 400, 40, canvas);
  drawCircular('3', 50, 300, 45, 305, canvas);
  draw('传输给金融', 790, 25, 700, 300, 250, 40, canvas);
  drawCircular('4', 700, 300, 695, 305, canvas);
  draw('金融返回签署url', 780, 25, 700, 400, 250, 40, canvas);
  drawCircular('5', 700, 400, 695, 405, canvas);
  draw('客户操作签署', 480, 25, 400, 500, 250, 40, canvas);
  drawCircular('6', 400, 500, 395, 505, canvas);
  draw('金融返回已签署合同', 760, 25, 700, 650, 250, 40, canvas);
  drawCircular('7', 700, 650, 695, 655, canvas);
  draw('crm归档', 220, 25, 50, 750, 400, 40, canvas);
  drawCircular('8', 50, 750, 45, 755, canvas);

  drawDashedLine(455, 120, 78, 0, canvas);
  drawDashedLine(535, 120, 0, 78, canvas);
  drawDashedLine(535, 245, 0, 20, canvas);
  drawDashedLine(535, 270, -275, 0, canvas);
  drawDashedLine(250, 270, 0, 30, canvas);
  drawDashedLine(455, 320, 230, 0, canvas);
  drawDashedLine(830, 350, 0, 48, canvas);
  drawDashedLine(680, 420, -150, 0, canvas);
  drawDashedLine(530, 420, 0, 75, canvas);
  drawDashedLine(655, 520, 168, 0, canvas);
  drawDashedLine(830, 520, 0, 125, canvas);
  drawDashedLine(685, 670, -435, 0, canvas);
  drawDashedLine(250, 670, 0, 65, canvas);

  drawRect(532, 192, canvas);
  drawRect(247, 292, canvas);
  drawRect(680, 317, canvas);
  drawRect(827, 392, canvas);
  drawRect(527, 492, canvas);
  drawRect(827, 642, canvas);
  drawRect(247, 742, canvas);
});

</script>
<style lang="scss" scope>
#canvasDom {
  text-align: center;
  overflow: hidden;
  overflow-x: auto;
}
</style>
