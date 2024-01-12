/**
 * @Author SJK
 * @Time 2024/1/12 15:32
 * @File Singleton.ts
 * @Description pass
 */

export default class Singleton {
    // 实例
    private static _instance: Singleton;

    /**
     * 获取实例
     */
    public static getInstance<T extends Singleton>(this: (new () => T) | typeof Singleton): T {
        const _class = this as typeof Singleton;
        if (!_class._instance) {
            _class._instance = new _class();
        }
        return _class._instance as T;
    }

    /**
     * 构造函数
     * @protected
     */
    protected constructor() {}
}
