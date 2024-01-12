/**
 * @Author SJK
 * @Time 2024/1/12 15:30
 * @File GameOfLife.ts
 * @Description pass
 */
import Singleton from "@/script/Singleton";

export default class GameOfLife extends Singleton {
    private _cells: boolean[][] = [];
    private _onRefresh?: (...args: any[]) => void;

    get cells(): boolean[][] {
        return this._cells;
    }

    set cells(value: boolean[][]) {
        this._cells = value;
        this._onRefresh?.();
    }

    registerOnRefresh(func: (...args: any[]) => void) {
        this._onRefresh = func;
    }
}
