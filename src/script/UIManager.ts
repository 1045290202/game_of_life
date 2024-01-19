/**
 * @Author SJK
 * @Time 2024/1/17 11:27
 * @File UIManager.ts
 * @Description pass
 */

import Singleton from "@/script/Singleton";
import { nextTick, type Ref } from "vue";
import { ref, watch } from "vue";
import GameManager from "@/script/GameManager";
import type Cell from "@/script/Cell";

export default class UIManager extends Singleton {
    // 细胞大小
    cellSize: number = 10;
    // 细胞间距
    cellPadding: number = 1;
    // 细胞颜色
    cellColor: string = "#000000";
    // 背景颜色
    backgroundColor: string = "#ffffff";
    // 细胞边框颜色
    cellBorderColor: string = "#c5c5c5";
    // 横向细胞数量
    horizontalCellCount: number = 80;
    // 纵向细胞数量
    verticalCellCount: number = 80;
    // 每次更新的时间间隔
    interval: number = 10;

    cellSizeRef: Ref<number> = ref(this.cellSize);
    cellColorRef: Ref<string> = ref(this.cellColor);
    backgroundColorRef: Ref<string> = ref(this.backgroundColor);
    cellBorderColorRef: Ref<string> = ref(this.cellBorderColor);
    horizontalCellCountRef: Ref<number> = ref(this.horizontalCellCount);
    verticalCellCountRef: Ref<number> = ref(this.verticalCellCount);
    intervalRef: Ref<number> = ref(this.interval);

    private _canvas: HTMLCanvasElement | null = null;
    private _ctx: CanvasRenderingContext2D | null = null;

    private _lastClickPosition: { x: number; y: number } | null = null;

    /**
     * 初始化
     */
    init(gameCanvas: HTMLCanvasElement) {
        this._canvas = gameCanvas;
        this._ctx = gameCanvas.getContext("2d");
        // 监听参数变化，更新参数，因为直接读取响应式变量比较消耗性能
        const refMap = new Map<string, [Ref<any>, Function?]>([
            ["cellSize", [this.cellSizeRef]],
            ["cellColor", [this.cellColorRef]],
            ["backgroundColor", [this.backgroundColorRef]],
            ["cellBorderColor", [this.cellBorderColorRef]],
            ["horizontalCellCount", [this.horizontalCellCountRef]],
            ["verticalCellCount", [this.verticalCellCountRef]],
            ["interval", [this.intervalRef]],
        ]);
        refMap.forEach((config, key) => {
            watch(config[0], (value) => {
                (this as any)[key] = value;
                config[1]?.();
            });
        });
        this.clearCanvas();
        this.drawBorders();
    }

    resetCanvasSize() {
        if (!this._canvas) {
            return;
        }
        this.clearCanvas();
        this._canvas.width = this.horizontalCellCount * this.cellSize + this.cellPadding;
        this._canvas.height = this.verticalCellCount * this.cellSize + this.cellPadding;
    }

    clearCanvas() {
        if (!this._canvas || !this._ctx) {
            return;
        }
        const canvas = this._canvas;
        const ctx = this._ctx;
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * 绘制边框
     */
    async drawBorders() {
        // 将当前canvas内容缓存成image
        await nextTick();
        if (!this._canvas || !this._ctx) {
            return;
        }

        const canvas = this._canvas;
        const ctx = this._ctx;
        ctx.strokeStyle = this.cellBorderColor;
        ctx.lineWidth = this.cellPadding;
        ctx.beginPath();
        const halfCellPadding = this.cellPadding / 2;
        for (let i = 0; i <= this.horizontalCellCount; i++) {
            const lineX = i * this.cellSize + halfCellPadding;
            ctx.moveTo(lineX, 0);
            ctx.lineTo(lineX, canvas.height);
        }
        for (let i = 0; i <= this.verticalCellCount; i++) {
            const lineY = i * this.cellSize + halfCellPadding;
            ctx.moveTo(0, lineY);
            ctx.lineTo(canvas.width, lineY);
        }
        ctx.stroke();
    }

    drawCell(cell: Cell) {
        if (!this._canvas || !this._ctx) {
            return;
        }
        const ctx = this._ctx;
        const size = this.cellSize - this.cellPadding;
        const borderWidth = this.cellPadding;
        if (!cell.isAlive) {
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(cell.x * this.cellSize + borderWidth, cell.y * this.cellSize + borderWidth, size, size);
            return;
        }
        ctx.fillStyle = this.cellColor;
        ctx.fillRect(cell.x * this.cellSize + borderWidth, cell.y * this.cellSize + borderWidth, size, size);
    }

    /**
     * 绘制细胞
     */
    drawCells() {
        if (!this._canvas || !this._ctx) {
            return;
        }

        const changedCellSet = GameManager.getInstance().changedCellSet;
        if (!changedCellSet.size) {
            return;
        }
        // const canvas = this._canvas;
        const ctx = this._ctx;
        const size = this.cellSize - this.cellPadding;
        const borderWidth = this.cellPadding;
        for (const cell of changedCellSet) {
            if (!cell.isAlive) {
                ctx.fillStyle = this.backgroundColor;
                ctx.fillRect(cell.x * this.cellSize + borderWidth, cell.y * this.cellSize + borderWidth, size, size);
                continue;
            }
            ctx.fillStyle = this.cellColor;
            ctx.fillRect(cell.x * this.cellSize + borderWidth, cell.y * this.cellSize + borderWidth, size, size);
        }

        // const cells: ReadonlyArray<ReadonlyArray<Cell>> | null = GameManager.getInstance().cells;
        // if (!cells) {
        //     return;
        // }
        // const canvas = this._canvas;
        // const ctx = this._ctx;
        // ctx.fillStyle = this.backgroundColor;
        // ctx.fillRect(0, 0, canvas.width, canvas.height);
        // ctx.fillStyle = this.cellColor;
        // const size = this.cellSize - this.cellPadding * 2;
        // for (let i = 0; i < cells.length; i++) {
        //     for (let j = 0; j < cells[i].length; j++) {
        //         if (cells[i][j].isAlive) {
        //             ctx.fillRect(
        //                 i * this.cellSize + this.cellPadding,
        //                 j * this.cellSize + this.cellPadding,
        //                 size,
        //                 size,
        //             );
        //         }
        //     }
        // }

        // ctx.fillStyle = "#59ffe6";
        // ctx.strokeStyle = "#ff9c59";
        // GameManager.getInstance().nextUpdateCellSet.forEach((cell) => {
        //     ctx.strokeRect(
        //         cell.x * this.cellSize + this.cellPadding,
        //         cell.y * this.cellSize + this.cellPadding,
        //         size,
        //         size,
        //     );
        //     // 画圆点
        //     ctx.beginPath();
        //     ctx.arc(
        //         cell.x * this.cellSize + this.cellSize / 2,
        //         cell.y * this.cellSize + this.cellSize / 2,
        //         this.cellSize / 10,
        //         0,
        //         2 * Math.PI,
        //     );
        //     ctx.fill();
        // });
    }

    onCanvasClick(event: MouseEvent) {
        const rect = this._canvas!.getBoundingClientRect();
        if (!rect) {
            return;
        }
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const i = Math.floor(x / this.cellSize);
        const j = Math.floor(y / this.cellSize);
        if (this._lastClickPosition?.x === i && this._lastClickPosition?.y === j) {
            return;
        }
        this._lastClickPosition = { x: i, y: j };
        const cell = GameManager.getInstance().toggleCell(i, j);
        if (!cell) {
            return;
        }
        UIManager.getInstance().drawCell(cell);
    }
}
