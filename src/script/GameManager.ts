/**
 * @Author SJK
 * @Time 2024/1/17 10:24
 * @File Game.ts
 * @Description pass
 */

import Singleton from "@/script/Singleton";
import Cell from "@/script/Cell";

export default class GameManager extends Singleton {
    private _cells: Cell[][] | null = null;
    private _aliveCellSet: Set<Cell> = new Set<Cell>();
    private _changedCellSet: Set<Cell> = new Set<Cell>();

    get cells(): ReadonlyArray<ReadonlyArray<Cell>> | null {
        return this._cells;
    }

    get nextUpdateCellSet(): ReadonlySet<Cell> {
        const set = new Set<Cell>();
        for (const cell of this._aliveCellSet) {
            set.add(cell);
            this._forEachNearbyCell(cell, (nearByCell) => {
                set.add(nearByCell);
            });
        }
        return set;
    }

    get aliveCellSet(): ReadonlySet<Cell> {
        return this._aliveCellSet;
    }

    get changedCellSet(): ReadonlySet<Cell> {
        return this._changedCellSet;
    }

    /**
     * 创建空的细胞集合
     * @param width
     * @param height
     */
    createEmptyCells(width: number, height: number) {
        this._aliveCellSet.clear();
        this._changedCellSet.clear();
        this._cells = [];
        for (let i = 0; i < width; i++) {
            this._cells[i] = [];
            for (let j = 0; j < height; j++) {
                this._cells[i][j] = new Cell(i, j);
            }
        }
    }

    /**
     * 创建随机的细胞集合
     * @param width
     * @param height
     * @param density 细胞密度，0-1
     */
    createRandomCells(width: number, height: number, density: number = 0.8) {
        this._aliveCellSet.clear();
        this._changedCellSet.clear();
        this._cells = [];
        for (let i = 0; i < width; i++) {
            this._cells[i] = [];
            for (let j = 0; j < height; j++) {
                this._cells[i][j] = new Cell(i, j, Math.random() > density);
            }
        }
    }

    /**
     * 创建“高斯帕机枪”不断创建滑翔机
     * @param width
     * @param height
     */
    createGospaMachineGunCells(width: number, height: number) {
        const arr = [
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                1, 1, 0,
            ],
            [
                0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
            [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0,
            ],
        ];

        this._aliveCellSet.clear();
        this._changedCellSet.clear();
        this._cells = [];
        for (let i = 0; i < width; i++) {
            this._cells[i] = [];
            for (let j = 0; j < height; j++) {
                this._cells[i][j] = new Cell(i, j, (arr[i]?.[j] ?? 0) === 1);
            }
        }
    }

    /**
     * 注册活细胞
     * @param cell
     */
    registerAliveCell(cell: Cell) {
        this._aliveCellSet.add(cell);
    }

    /**
     * 注销活细胞
     * @param cell
     */
    unregisterAliveCell(cell: Cell) {
        this._aliveCellSet.delete(cell);
    }

    /**
     * 注册变化的细胞
     * @param cell
     */
    registerChangedCell(cell: Cell) {
        this._changedCellSet.add(cell);
    }

    /**
     * 获取某个细胞附近的活细胞数量
     * @param cell
     */
    getNearbyAliveCellCount(cell: Cell): number {
        if (!this._cells) {
            return 0;
        }
        let count = 0;
        this._forEachNearbyCell(cell, (nearByCell) => {
            if (nearByCell.isAlive) {
                count++;
            }
        });
        return count;
    }

    private _forEachNearbyCell(cell: Cell, func: (cell: Cell) => void) {
        if (!this._cells) {
            return;
        }
        const { x, y } = cell;
        const horizontalCount = this._cells.length;
        const verticalCount = this._cells[0]?.length ?? 0;
        for (let i = x - 1; i <= x + 1; i++) {
            for (let j = y - 1; j <= y + 1; j++) {
                if (i === x && j === y) {
                    continue;
                }
                // 边界处理，超出便捷时，取反方向的细胞
                // const x = i < 0 ? arraySize - 1 : i >= arraySize ? 0 : i;
                // const y = j < 0 ? arraySize - 1 : j >= arraySize ? 0 : j;
                const useX = i < 0 ? horizontalCount - 1 : i >= horizontalCount ? 0 : i;
                const useY = j < 0 ? verticalCount - 1 : j >= verticalCount ? 0 : j;
                // const useX = (i + horizontalCount) % horizontalCount;
                // const useY = (j + verticalCount) % verticalCount;
                const cell = this._cells[useX][useY];
                func(cell);
            }
        }
    }

    /**
     * 更新一次细胞状态
     */
    update() {
        this._changedCellSet.clear();
        const nextUpdateCellSet = this.nextUpdateCellSet;
        nextUpdateCellSet.forEach((cell) => {
            cell.update();
        });
        nextUpdateCellSet.forEach((cell) => {
            cell.evolve();
        });
    }

    toggleCell(x: number, y: number) {
        const cell = this._cells?.[x]?.[y];
        if (!cell) {
            return cell;
        }
        cell.toggleCurrent();
        return cell;
    }
}

(window as any)["GameManager"] = GameManager;
