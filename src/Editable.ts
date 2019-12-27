import EditorRange from './core/EditorRange';

/**
 * 可编辑工具
 */
export default class Editable {
    /**
     * 备份选区
     */
    private static _currentRange: EditorRange | null = null;

    /**
     * 获取当前缓存的 EditorRange
     */
    public static getCurrentRange(): EditorRange | null {
        return Editable._currentRange;
    }

    /**
     * 备份选区 以便完成一些工作后恢复光标位置
     * @param range EditorRange
     */
    public static backupCurrentRange(range?: EditorRange): void {
        if(undefined !== range) {
            Editable._currentRange = range;

            return;
        }

        const gettedRange = EditorRange.getSingleRangeFromNativeSelection();

        if(null !== gettedRange) {
            Editable._currentRange = gettedRange;
        }
    }

    /**
     * 恢复保存的选区
     */
    public static resumeSelection(): void {
        if(null === Editable._currentRange) {
            return;
        }

        const selection = EditorRange.getSelectionFromNative();

        if(null === selection) {
            return;
        }

        if(selection.rangeCount > 0) {
            selection.removeAllRanges();
        }

        selection.addRange(Editable._currentRange.nativeRange);
    }

    /**
     * 重新设置光标位置
     * @param {any} node 节点
     * @param {Boolean} toEnd 是否定位到末尾
     */
    public static resetRangeAt(node: any, toEnd?: boolean): void {
        const range = EditorRange.createNativeRange();

        if(null === range) {
            return;
        }

        if(true === toEnd) {
            // If the nodeType of node is one of Text, Comment, or CDATASection
            // then the offset is the number of characters contained in the node.
            // Others offset is the number of child nodes.
            const position = (3 === node.nodeType || 4 === node.nodeType || 8 === node.nodeType)
                ? node.nodeValue.length
                : node.childNodes.length;
            range.setStart(node, position);
            range.setEnd(node, position);

        } else {
            range.setStart(node, 0);
            range.setEnd(node, 0);
        }

        Editable.backupCurrentRange(new EditorRange(range));
        Editable.resumeSelection();
    }

    public static execCommand(aCommandName: string, aShowDefaultUI: boolean, aValueArgument?: string): boolean {
        // 执行命令前 需要知道光标的位置
        Editable.resumeSelection();

        return document.execCommand(aCommandName, aShowDefaultUI, aValueArgument);
    }

    public static queryCommandState(command: string): boolean {
        return document.queryCommandState(command);
    }
}
