/**
 * @Author SJK
 * @Time 2024/1/17 10:18
 * @File Cell.ts
 * @Description 一个细胞
 */
import GameManager from "@/script/GameManager";

export default class Cell {
    private _isAlive: boolean = false;
    private _isNextAlive: boolean = false;
    private readonly _x: number = 0;
    private readonly _y: number = 0;

    get isAlive(): boolean {
        return this._isAlive;
    }

    get isNextAlive(): boolean {
        return this._isNextAlive;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    constructor(x: number, y: number, isAlive: boolean = false) {
        this._x = x;
        this._y = y;
        this._isAlive = isAlive;
        this._isNextAlive = isAlive;
        GameManager.getInstance().registerChangedCell(this);
        this._isAlive && GameManager.getInstance().registerAliveCell(this);
    }

    /**
     * 重置细胞
     */
    reset() {
        this._isAlive = false;
        this._isNextAlive = false;
        GameManager.getInstance().registerChangedCell(this);
        GameManager.getInstance().unregisterAliveCell(this);
    }

    /**
     * 细胞进化
     */
    evolve() {
        if (this._isAlive !== this._isNextAlive) {
            GameManager.getInstance().registerChangedCell(this);
        }
        this._isAlive = this._isNextAlive;
        if (this._isAlive) {
            GameManager.getInstance().registerAliveCell(this);
        } else {
            GameManager.getInstance().unregisterAliveCell(this);
        }
    }

    /**
     * 细胞复活
     */
    revive() {
        if (this._isAlive !== this._isNextAlive) {
            GameManager.getInstance().registerChangedCell(this);
        }
        this._isNextAlive = true;
        // GameManager.getInstance().registerAliveCell(this);
    }

    /**
     * 细胞死亡
     */
    die() {
        if (this._isAlive !== this._isNextAlive) {
            GameManager.getInstance().registerChangedCell(this);
        }
        this._isNextAlive = false;
        // GameManager.getInstance().unregisterAliveCell(this);
    }

    /**
     * 切换细胞当前状态
     */
    toggleCurrent() {
        this._isNextAlive = !this._isAlive;
        this._isAlive = this._isNextAlive;
        GameManager.getInstance().registerChangedCell(this);
        if (this._isAlive) {
            GameManager.getInstance().registerAliveCell(this);
        } else {
            GameManager.getInstance().unregisterAliveCell(this);
        }
    }

    /**
     * 更新细胞状态
     * @return 是否改变
     */
    update() {
        const count = GameManager.getInstance().getNearbyAliveCellCount(this);
        if (this._isAlive) {
            if (count < 2 || count > 3) {
                this.die();
                return true;
            }
            return false;
        }
        if (count === 3) {
            this.revive();
            return true;
        }
        return false;
    }
}
