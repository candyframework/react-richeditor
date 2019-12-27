/**
 * 事件类
 */
export default class Event {

    /**
     * 事件映射缓存
     */
    private $eventBinMap: any;

    constructor() {
        this.$eventBinMap = {};
    }

    /**
     * 添加事件监听
     *
     * @param eventName 事件名
     * @param handler 事件处理器
     * @param thisObject
     */
    public on(eventName: string, handler: any, thisObject: any = null): void {
        let map = this.$eventBinMap;

        if(undefined === map[eventName]) {
            map[eventName] = [];
        }

        let eventBin = {
            target: this,
            type: eventName,
            handler: handler,
            thisObject: thisObject
        };

        map[eventName].push(eventBin);
    }

    /**
     * 移除事件
     *
     * @param eventName 事件名
     * @param handler 事件处理器
     * @param thisObject
     */
    public off(eventName: string, handler: any, thisObject: any = null): void {
        let map = this.$eventBinMap;

        if(undefined === map[eventName]) {
            return;
        }

        for(let i=0, len=map[eventName].length, bin=null; i<len; i++) {
            bin = map[eventName][i];

            if(thisObject === bin.thisObject && handler === bin.handler) {
                map[eventName].splice(i, 1);

                break;
            }
        }
    }

    /**
     * 触发事件
     *
     * @param eventName 事件名
     * @param data 数据
     */
    public fire(eventName: string, data: any = null): void {
        let map = this.$eventBinMap;

        if(undefined === map[eventName]) {
            return;
        }

        for(let i=0, len=map[eventName].length, bin=null; i<len; i++) {
            bin = map[eventName][i];

            bin.handler.call(bin.thisObject, data);
        }
    }

}
