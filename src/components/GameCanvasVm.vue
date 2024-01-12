<script setup lang="ts">
import GameCanvasView from "./GameCanvasView.vue";
import { onMounted, reactive, ref, watch } from "vue";
import GameOfLife from "@/script/GameOfLife";

const arraySize: number = 1000;
let cacheGameOfLifeArray: boolean[][] = [];

let isRunning: boolean = false;

function startTimer() {
    let lastTimestamp = 0;
    // 用于计数，第一帧由于不足一帧，忽略
    let frameCount = -1;
    isRunning = true;
    const loopFunc = (timestamp: number) => {
        const deltaTime = timestamp - lastTimestamp;
        lastTimestamp = timestamp;
        // if (frameCount === 0) {
        //     start();
        // }
        if (frameCount > 0) {
            update(deltaTime);
        }
        frameCount++;
        if (!isRunning) {
            return;
        }
        requestAnimationFrame(loopFunc);
    };

    requestAnimationFrame(loopFunc);
}

function stopTimer() {
    isRunning = false;
}

/* region 游戏主逻辑 */

/**
 * 开始
 */
function start() {
    randomGameOfLifeArray();
}

/**
 * 更新
 * @param dt
 */
function update(dt: number) {
    const newGameOfLifeArray: boolean[][] = new Array(arraySize);
    for (let i = 0; i < arraySize; i++) {
        newGameOfLifeArray[i] = new Array(arraySize);
        for (let j = 0; j < arraySize; j++) {
            const count = getAroundCount(i, j);
            if (cacheGameOfLifeArray[i][j]) {
                // 活细胞
                // 1. 周围少于2个活细胞，死亡
                // 2. 周围大于3个活细胞，死亡
                newGameOfLifeArray[i][j] = count >= 2 && count <= 3;
                continue;
            }

            // 死细胞
            // 3. 死细胞周围有3个活细胞，复活
            newGameOfLifeArray[i][j] = count === 3;
        }
    }
    cacheGameOfLifeArray = newGameOfLifeArray;
    applyGameOfLifeArray();
}

function onCellClick(col: number, row: number) {
    cacheGameOfLifeArray[col][row] = !cacheGameOfLifeArray[col][row];
    applyGameOfLifeArray();
}

function applyGameOfLifeArray() {
    GameOfLife.getInstance().cells = cacheGameOfLifeArray;
}

/**
 * 初始化游戏数组
 */
function resetGameOfLifeArray() {
    stopTimer();
    cacheGameOfLifeArray = [];
    for (let i = 0; i < arraySize; i++) {
        cacheGameOfLifeArray[i] = [];
        for (let j = 0; j < arraySize; j++) {
            cacheGameOfLifeArray[i].push(false);
        }
    }
    applyGameOfLifeArray();
}

function randomGameOfLifeArray() {
    stopTimer();
    cacheGameOfLifeArray = [];
    for (let i = 0; i < arraySize; i++) {
        cacheGameOfLifeArray[i] = [];
        for (let j = 0; j < arraySize; j++) {
            cacheGameOfLifeArray[i][j] = Math.random() > 0.7;
        }
    }
    applyGameOfLifeArray();
}

/**
 * “高斯帕机枪”不断制造“滑翔机”
 */
function createGospaMachineGun() {
    stopTimer();
    resetGameOfLifeArray();
    const arr = [
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
            1, 0,
        ],
        [
            0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
        [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
        ],
    ];
    for (let i = 0; i < arr.length; i++) {
        cacheGameOfLifeArray[i + 15].splice(10, arr[i].length, ...arr[i].map((v) => v === 1));
    }
    applyGameOfLifeArray();
}

/**
 * 获取周围活细胞数量，如果在边界外，则使用对边的细胞
 * @param col
 * @param row
 */
function getAroundCount(col: number, row: number): number {
    let count = 0;
    for (let i = col - 1; i <= col + 1; i++) {
        for (let j = row - 1; j <= row + 1; j++) {
            if (i === col && j === row) {
                continue;
            }
            const x = i < 0 ? arraySize - 1 : i >= arraySize ? 0 : i;
            const y = j < 0 ? arraySize - 1 : j >= arraySize ? 0 : j;
            if (cacheGameOfLifeArray[x][y]) {
                count++;
            }
        }
    }
    return count;
}

/* endregion 游戏主逻辑 */

onMounted(() => {
    resetGameOfLifeArray();
});
</script>

<template>
    <button @click="resetGameOfLifeArray">重置</button>
    <button @click="randomGameOfLifeArray">随机</button>
    <button @click="createGospaMachineGun">高斯帕机枪</button>
    <button @click="startTimer">开始</button>
    <button @click="stopTimer">停止</button>
    <button @click="update(0)">下一帧</button>
    <GameCanvasView :on-cell-click="onCellClick" />
</template>

<style scoped></style>
