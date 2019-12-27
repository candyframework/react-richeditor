/**
 * 编辑器属性
 */
export default interface EditorProps {
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
