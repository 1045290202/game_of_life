<script setup lang="ts">
import { nextTick, onMounted, ref, watch, watchEffect } from "vue";
import GameOfLife from "@/script/GameOfLife";

const props = defineProps<{
    onCellClick: (col: number, row: number) => void;
}>();

const cellSize: number = 8;
const cellPadding: number = 1;
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasSize = ref<[number, number]>([0, 0]);

async function refresh() {
    const canvas = canvasRef.value;
    if (!canvas) {
        return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        return;
    }
    const cells = GameOfLife.getInstance().cells;
    canvasSize.value = [cells.length * cellSize, cells.length * cellSize];
    await nextTick();
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    const size = cellSize - cellPadding * 2;
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (cells[i][j]) {
                ctx.fillRect(i * cellSize + cellPadding, j * cellSize + cellPadding, size, size);
            }
        }
    }
}

function onCanvasClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    // 找到点击的格子
    const canvas = canvasRef.value;
    if (!canvas) {
        return;
    }
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const i = Math.floor(x / cellSize);
    const j = Math.floor(y / cellSize);
    props.onCellClick(i, j);
}

onMounted(() => {
    GameOfLife.getInstance().registerOnRefresh(refresh);
});
</script>

<template>
    <canvas ref="canvasRef" :width="canvasSize[0]" :height="canvasSize[1]" @click.left="onCanvasClick"></canvas>
</template>

<style scoped>
canvas {
    border: 1px solid #000;
}
</style>
