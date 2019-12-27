/**
 * 选区
 */
export default class EditorRange {
    public nativeRange: any;

    public collapsed: boolean;
    public startContainer: any;
    public endContainer: any;
    public startOffset: any;
    public endOffset: any;
    public commonAncestorContainer: any;

    public static TOP_DATA_ROLE: string = 'editor-content';

    /**
     * 获取 EditorRange 对象
     */
    public static getSingleRangeFromNativeSelection(): EditorRange | null {
        let selection = null;

        if( null !== (selection = EditorRange.getSelectionFromNative()) ) {
            if(0 === selection.rangeCount) {
                return null;
            }

            return new EditorRange(selection.getRangeAt(0));
        }

        return null;
    }

    /**
     * 获取 native selection
     */
    public static getSelectionFromNative(): Selection | null {
        if('function' === typeof window.getSelection) {
            return window.getSelection();
        }

        return null;
    }

    /**
     * 获取 native range
     */
    public static createNativeRange(): Range | null {
        if('function' === typeof document.createRange) {
            return document.createRange();
        }

        return null;
    }

    constructor(nativeRange: Range) {
        this.nativeRange = nativeRange;

        this.collapsed = nativeRange.collapsed;
        this.startContainer = nativeRange.startContainer;
        this.endContainer = nativeRange.endContainer;
        this.startOffset = nativeRange.startOffset;
        this.endOffset = nativeRange.endOffset;
        this.commonAncestorContainer  = nativeRange.commonAncestorContainer;
    }

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
    public getClosestContainerElement(): any {
        let node = this.startContainer;

        return 1 === node.nodeType ? node : node.parentNode;
    }

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
    public getOutermostElement(basedOnEnd: boolean = false): any {
        let node: any = basedOnEnd
            ? this.endContainer
            : this.startContainer;

        // 文本直接在可编辑容器下面
        if(3 === node.nodeType && EditorRange.TOP_DATA_ROLE === node.parentNode.getAttribute('data-role')) {
            return null;
        }
        // 选区直接在可编辑容器下面
        if(1 === node.nodeType && EditorRange.TOP_DATA_ROLE === node.getAttribute('data-role')) {
            return null;
        }

        while( null !== node && EditorRange.TOP_DATA_ROLE !== node.parentNode.getAttribute('data-role') ) {
            node = node.parentNode;
        }

        return node;
    }

    /**
     * 当前选区是否在某个元素中
     *
     * @param {String} nodeName 小写标签名
     * @param {Boolean} basedOnEnd 是否基于选区末尾计算
     */
    public currentInNode(nodeName: string, basedOnEnd: boolean = false): boolean {
        let ret = false;
        let node: any = basedOnEnd
            ? this.endContainer
            : this.startContainer;

        // 文本直接在可编辑容器下面
        if(3 === node.nodeType && EditorRange.TOP_DATA_ROLE === node.parentNode.getAttribute('data-role')) {
            return false;
        }
        // 选区直接在可编辑容器下面
        if(1 === node.nodeType && EditorRange.TOP_DATA_ROLE === node.getAttribute('data-role')) {
            return false;
        }

        while( null !== node ) {
            if(1 === node.nodeType && EditorRange.TOP_DATA_ROLE === node.getAttribute('data-role')) {
                break;
            }

            if(nodeName === node.nodeName.toLowerCase()) {
                ret = true;
                break;
            }

            node = node.parentNode;
        }

        return ret;
    }

    /**
     * 获取从内到外的选区路径
     *
     * @param {Boolean} basedOnEnd 是否基于选区末尾计算
     */
    public pathInfo(basedOnEnd: boolean = false): any[] {
        const ret = [];

        let node: any = basedOnEnd
            ? this.endContainer
            : this.startContainer;

        ret.push(node);

        while( null !== node && EditorRange.TOP_DATA_ROLE !== node.parentNode.getAttribute('data-role') ) {
            node = node.parentNode;

            ret.push(node);
        }

        return ret;
    }
}
