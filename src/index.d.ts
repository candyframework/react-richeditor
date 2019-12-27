import * as React from 'react';

interface Event {
    /**
     * 添加事件监听
     *
     * @param eventName 事件名
     * @param handler 事件处理器
     * @param thisObject
     */
    on(eventName: string, handler: any, thisObject?: any): void;

    /**
     * 移除事件
     *
     * @param eventName 事件名
     * @param handler 事件处理器
     * @param thisObject
     */
    off(eventName: string, handler: any, thisObject?: any): void;

    /**
     * 触发事件
     *
     * @param eventName 事件名
     * @param data 数据
     */
    fire(eventName: string, data?: any): void;
}

/**
 * 编辑器属性
 */
interface EditorProps {
    /**
     * 无 UI 插件列表
     */
    plugins?: any;
    /**
     * 具 UI 挂件配置
     */
    widgets?: any;
    /**
     * 自动聚焦
     */
    autoFocus?: boolean;
    /**
     * 最小高度
     */
    minHeight?: number;
    /**
     * 内容区样式
     */
    contentClassName?: string;
    /**
     * 换行标签
     */
    lineMode?: string;
}

/**
 * Widget 属性
 */
interface WidgetProps {
    editor: Editor;
}

/**
 * 发布器主类
 */
export default class Editor extends React.Component<EditorProps> {
    event: Event;

    constructor(props: any);

    /**
     * 获取内容 dom 节点
     */
    getContentDom(): any;

    /**
     * 获取挂件节点
     */
    getWidgetsDom(): any;

    /**
     * 定位光标到内容最后一个节点
     *
     * @param {Boolean} toEnd 是否将光标定位到末尾
     */
    resetRangeAtEndElement(toEnd?: boolean): void;

    /**
     * 设置内容
     *
     * @param {String} data
     */
    setContent(data: string): void;

    /**
     * 获取内容
     */
    getContent(): string;

    /**
     * 获取纯文本内容
     */
    getPlainContent(): string;
}


/**
 * 工具类
 */
export class Tools {
    /**
     * 删除两端字符
     * @param {String} str 原始字符串
     * @param {String} character 要删除的字符
     */
    static trimChar(str: string, character: string): string;

    /**
     * 首字母大写
     * @param {String} str 原始字符串
     */
    static ucFirst(str: string): string;

    /**
     * 过滤 html 标签
     * @param {String} str 原始字符串
     * @param {String} allowed 合法的标签
     *
     * ``` filterTags('<a>abc</a>xyz') -> abcxyz ```
     * ``` filterTags('<a>abc</a><i>xyz</i>', '<a><b>') -> <a>abc</a>xyz ```
     */
    static filterTags(str: string, allowed?: string): string;

    /**
     * 换行处理
     * @param {String} content 原始字符串
     */
    static nl2br(content: string): string;
}

/**
 * Range
 */
export class EditorRange {
    constructor(nativeRange: Range);

    /**
     * 获取 EditorRange 对象
     */
    static getSingleRangeFromNativeSelection(): EditorRange | null;

    /**
     * 获取 native selection
     */
    static getSelectionFromNative(): Selection | null;

    /**
     * 获取 native range
     */
    static createNativeRange(): Range | null;

    /**
     * 获取距离选区最近的标签元素
     *
     * 光标在 b 会得到 b 元素
     * <div contenteditable="true">
     *      <p>
     *          <b>aabb|ccdd</b>
     *      </p>
     * </div>
     */
    getClosestContainerElement(): any;

    /**
     * 获取距离可编辑容器最近的最外层元素
     *
     * 光标在 b 会得到 p 元素
     * <div contenteditable="true">
     *      <p>
     *          <b>aabb|ccdd</b>
     *      </p>
     * </div>
     *
     * @param {Boolean} basedOnEnd 是否基于选区末尾计算
     */
    getOutermostElement(basedOnEnd?: boolean): any;

    /**
     * 当前选区是否在某个元素中
     *
     * @param {String} nodeName 小写标签名
     * @param {Boolean} basedOnEnd 是否基于选区末尾计算
     */
    currentInNode(nodeName: string, basedOnEnd?: boolean): boolean;

    /**
     * 获取从内到外的选区路径
     *
     * @param {Boolean} basedOnEnd 是否基于选区末尾计算
     */
    pathInfo(basedOnEnd?: boolean): any[];
}

/**
 * 可编辑工具
 */
export class Editable {
    /**
     * 获取当前缓存的 EditorRange
     */
    static getCurrentRange(): EditorRange;

    /**
     * 备份选区 以便完成一些工作后恢复光标位置
     * @param range EditorRange
     */
    static backupCurrentRange(range?: EditorRange): void;

    /**
     * 恢复保存的选区
     */
    static resumeSelection(): void;

    /**
     * 重新设置光标位置
     * @param {any} node 节点
     * @param {Boolean} toEnd 是否定位到末尾
     */
    static resetRangeAt(node: any, toEnd?: boolean): void;

    static execCommand(aCommandName: string, aShowDefaultUI: boolean, aValueArgument?: string): boolean;

    static queryCommandState(command: string): boolean;
}

/**
 * Widget
 */
export abstract class Widget extends React.Component<WidgetProps, any> {
    constructor(props: WidgetProps);

    /**
     * 状态反射前需要做的处理
     */
    beforeStatusReflect(): void;

    /**
     * 状态反射处理 每当发生 selectionchange 事件时该方法将会执行
     */
    abstract statusReflect(): void;

    /**
     * 状态反射后需要做的处理
     */
    afterStatusReflect(): void;
}
