<script setup lang="ts">
import { onMounted } from "vue";
import GameManager from "@/script/GameManager";
import UIManager from "@/script/UIManager";

const cellSizeRef = UIManager.getInstance().cellSizeRef;
const horizontalCellCountRef = UIManager.getInstance().horizontalCellCountRef;
const verticalCellCountRef = UIManager.getInstance().verticalCellCountRef;
const intervalRef = UIManager.getInstance().intervalRef;

let isMouseDown = false;

function onCanvasMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    isMouseDown = true;
}

function onCanvasMouseUp(event: MouseEvent) {
    if (event.button !== 0) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    isMouseDown = false;
    UIManager.getInstance().onCanvasClick(event);
}

function onCanvasMouseMove(event: MouseEvent) {
    if (event.button !== 0) {
        return;
    }
    if (!isMouseDown) {
        return;
    }
    event.preventDefault();
    event.stopPropagation();
    UIManager.getInstance().onCanvasClick(event);
}

function onCreateCellsEnd() {
    onPauseButtonClick();
    UIManager.getInstance().resetCanvasSize();
    UIManager.getInstance().clearCanvas();
    UIManager.getInstance().drawBorders();
    UIManager.getInstance().drawCells();
}

function onResetButtonClick() {
    GameManager.getInstance().createEmptyCells(
        UIManager.getInstance().horizontalCellCount,
        UIManager.getInstance().verticalCellCount,
    );
    onCreateCellsEnd();
}

function onRandomButtonClick() {
    GameManager.getInstance().createRandomCells(
        UIManager.getInstance().horizontalCellCount,
        UIManager.getInstance().verticalCellCount,
    );
    onCreateCellsEnd();
}

function onGospaMachineGunButtonClick() {
    GameManager.getInstance().createGospaMachineGunCells(
        UIManager.getInstance().horizontalCellCount,
        UIManager.getInstance().verticalCellCount,
    );
    onCreateCellsEnd();
}

let timer: number | undefined;

function onStartButtonClick() {
    onPauseButtonClick();
    timer = setInterval(() => {
        GameManager.getInstance().update();
        UIManager.getInstance().drawCells();
    }, UIManager.getInstance().interval);
}

function onPauseButtonClick() {
    clearInterval(timer);
    timer = undefined;
}

function onEvolveButtonClick() {
    GameManager.getInstance().update();
    UIManager.getInstance().drawCells();
}

onMounted(() => {
    UIManager.getInstance().init(document.querySelector("#gameCanvas") as HTMLCanvasElement);
    GameManager.getInstance().createEmptyCells(
        UIManager.getInstance().horizontalCellCount,
        UIManager.getInstance().verticalCellCount,
    );
    UIManager.getInstance().resetCanvasSize();
    UIManager.getInstance().clearCanvas();
    // UIManager.getInstance().drawCells();
    // GameOfLife.getInstance().registerOnRefresh(refresh);
});
</script>

<template>
    <div class="functions">
        <div class="labels">
            <label for="cellSize">
                单元格大小：
                <input type="number" id="cellSize" v-model="cellSizeRef" min="1" />
            </label>
            <label for="width">
                宽度（格）：
                <input type="number" id="width" v-model="horizontalCellCountRef" min="1" max="1000" />
            </label>
            <label for="height">
                高度（格）：
                <input type="number" id="height" v-model="verticalCellCountRef" min="1" max="1000" />
            </label>
            <label for="interval">
                更新间隔：
                <input type="number" id="interval" v-model="intervalRef" min="0" step="10" />
            </label>
        </div>
        <div class="buttons">
            <button @click="onResetButtonClick">重置</button>
            <button @click="onRandomButtonClick">随机</button>
            <button @click="onGospaMachineGunButtonClick">高斯帕机枪</button>
            <button @click="onStartButtonClick">开始</button>
            <button @click="onPauseButtonClick">暂停</button>
            <button @click="onEvolveButtonClick">进化</button>
        </div>
    </div>
    <div class="canvas_wrapper">
        <div class="canvas_holder">
            <canvas
                id="gameCanvas"
                @mousedown="onCanvasMouseDown"
                @mouseup="onCanvasMouseUp"
                @mousemove="onCanvasMouseMove"
            ></canvas>
        </div>
    </div>
</template>

<style scoped>
.labels,
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1em;
}

.labels > label:not(:last-child) {
    margin: 0 1em 0 0;
}

.labels input {
    width: 5em;
    border: 1px solid #c5c5c5;
    border-radius: 0.5em;
    padding: 0.3em 0 0.3em 0.8em;
}

.labels input:focus {
    outline: 1px solid #a8a8a8;
}

.buttons > button:not(:last-child) {
    margin: 0 1em 0 0;
}

.buttons > button {
    border: 1px solid #c5c5c5;
    border-radius: 0.5em;
    background-color: #fff;
    padding: 0.3em 0.8em;
    transition: background-color 0.1s ease-in-out;
}

.buttons > button:hover {
    background-color: #efefef;
}

.buttons > button:active {
    background-color: #e1e1e1;
}

.canvas_wrapper {
    display: flex;
}

.canvas_holder {
    margin: 0 auto;
    border: 1px solid #c5c5c5;
    padding: 0.75em;
    border-radius: 0.5em;
}

#gameCanvas {
    margin: 0 auto;
}
</style>
