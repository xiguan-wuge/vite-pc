<template>
  <div class="cancvas-box" :style="{height: contentHeight + 'px'}">
    <canvas
      id="canvas-id"
      class="canvas-class"
      :width="contentWidth"
      :height="contentHeight"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';

interface IProps {
  identifyCode?: string // 默认注册码
  fontSizeMin?: number // 字体最小值
  fontSizeMax?: number // 字体最大值
  backgroundColorMin?: number // 验证码图片背景色最小值
  backgroundColorMax?: number // 验证码图片背景色最小值
  dotColorMin?: number // 背景干扰点最小值
  dotColorMax?: number // 背景干扰点最小值
  contentWidth?: number // 容器宽度
  contentHeight?: number // 容器高度
}
// withDefaults 为props添加默认值
const props = withDefaults(defineProps<IProps>(), {
  identifyCode: '1234',
  fontSizeMin: 25,
  fontSizeMax: 35,
  backgroundColorMin: 200,
  backgroundColorMax: 220,
  dotColorMin: 60,
  dotColorMax: 120,
  contentWidth: 100,
  contentHeight: 40,
})

const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomColor = (min: number, max: number) => {
  const r = randomNum(min, max)
  const g = randomNum(min, max)
  const b = randomNum(min, max)
  return `rgb(${r}, ${g}, ${b})`
}

const drawPic = () => {
  const canvas = document.getElementById('canvas-id') as HTMLCanvasElement
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.textBaseline = 'bottom'

  // 绘制背景
  ctx.fillStyle = '#e6ecfd'
  ctx.fillRect(0,0, props.contentWidth, props.contentHeight)

  // 绘制文字
  for(let i = 0, len = props.identifyCode.length; i < len; i++) {
    drawText(ctx, props.identifyCode[i], i)
  }
  drawLine(ctx)
  drawDot(ctx)
}

const drawText = (ctx: CanvasRenderingContext2D, txt: string, i:number) => {
  ctx.fillStyle = randomColor(50, 160) // 随机生产字体颜色
  ctx.font = randomNum(props.fontSizeMin, props.fontSizeMax) + 'px SimHei' // 随机生成字体大小
  let x = (i + 1) * (props.contentWidth / (props.identifyCode.length + 1)) // ?
  let y = randomNum(props.fontSizeMax, props.contentHeight - 5)
  const deg = randomNum(-30, 30)
  // 修改坐标原点和旋转角度
  ctx.translate(x,y)
  ctx.rotate((deg * Math.PI) / 180)
  ctx.fillText(txt, 0, 0)
  // 回复坐标原点和旋转角度
  ctx.rotate((-deg * Math.PI) / 180)
  ctx.translate(-x, -y)
}

// 绘制干扰线
const drawLine = (ctx: CanvasRenderingContext2D) => {
  for(let i = 0; i < 4; i++) {
    ctx.strokeStyle = randomColor(100, 200)
    ctx.beginPath()
    ctx.moveTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
    )
    ctx.lineTo(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
    )
    ctx.stroke()
  }
}

// 绘制干扰点
const drawDot = (ctx: CanvasRenderingContext2D) => {
  for(let i = 0; i < 30; i++) {
    ctx.fillStyle = randomColor(0, 255)
    ctx.beginPath()
    ctx.arc(
      randomNum(0, props.contentWidth),
      randomNum(0, props.contentHeight),
      1,
      0,
      2 * Math.PI,
    )
    ctx.fill()
  }
}

onMounted(() => {
  drawPic()
})
watch(
  () => props.identifyCode,
  val => {
    console.log('identifyCode', val)
    drawPic()
  }
)
</script>

<style lang="less"  scoped>
.canvas-box {
  cursor: pointer;
  .canvas-class {
    height: 100%
  }
  .el-input-group__append {
    padding: 0;
  }
}

</style>