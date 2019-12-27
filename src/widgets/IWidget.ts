/**
 * 挂件接口层
 */
export default interface IWidget {

    /**
     * 状态反射前需要做的处理
     */
    beforeStatusReflect(): void;

    /**
     * 状态反射处理 每当发生 selectionchange 事件时该方法将会执行
     */
    statusReflect(): void;

     /**
     * 状态反射后需要做的处理
     */
    afterStatusReflect(): void;
}
