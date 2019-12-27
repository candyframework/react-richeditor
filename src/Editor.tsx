import * as React from 'react';

import Tools from './Tools';
import Event from './core/Event';
import Editable from './Editable';

import EditorProps from './interfaces/EditorProps';

/**
 * React 富文本发布器
 */
export default class Editor extends React.Component<EditorProps> {
    static defaultProps: EditorProps = {
        plugins: null,
        widgets: null,
        autoFocus: false,
        minHeight: 200,
        contentClassName: '',
        lineMode: 'p'
    };

    static ROLE_WIDGETSBAR: string = 'editor-widgetsbar';
    static ROLE_CONTENT: string = 'editor-content';

    /**
     * 发布器事件
     */
    public event: Event;

    /**
     * 插件实例缓存
     */
    public pluginInstances: any;

    /**
     * 发布器的引用
     */
    public $wrapper: any;

    constructor(props: any) {
        super(props);

        this.$wrapper = React.createRef();

        this.pluginInstances = null;
        this.event = new Event();
    }

    componentWillUnmount() {
        this.destroy();
    }

    componentDidMount() {
        this.initEvent();
        this.resetRangeAtEndElement(true);
        this.initPlugins();

        window.setTimeout(() => {
            this.event.fire('ready');
        }, 100);
    }

    /**
     * 销毁
     */
    private destroy(): void {
        // 删除事件
        this.deleteEvent();

        // 卸载插件
        if(null !== this.pluginInstances) {
            for(let name in this.pluginInstances) {
                if(undefined !== this.pluginInstances[name].destroy) {
                    this.pluginInstances[name].destroy();
                }
            }
            this.pluginInstances = null;
        }

        // this.event = null;
        this.$wrapper = null;
    }

    private initEvent(): void {
        const content = this.getContentDom();
        const widgetsBar = this.getWidgetsDom();

        // content
        content.onkeydown = (e: any) => {
            this.handlerKeydownEvent(e);
        };
        content.onkeyup = (e: any) => {
            this.handlerKeyupEvent(e);
        };
        content.onclick = () => {
            // onclick 发生时一定有 mouseup 时间
            // 所以逻辑用 mouseup 处理
        };
        content.onmouseup = (e: any) => {
            this.handlerContentClickEvent(e);
        };

        // widgets
        widgetsBar.onmousedown = (e: any) => {
            e.preventDefault();
            return false;
        };
    }

    private deleteEvent(): void {
        const content = this.getContentDom();
        const widgetsBar = this.getWidgetsDom();

        widgetsBar.onmousedown = null;
        content.onkeydown = null;
        content.onkeyup = null;
        content.onclick = null;
        content.onmouseup = null;
    }

    private handlerKeydownEvent(e: any): void {
        this.event.fire('keydown', e);
    }

    private handlerKeyupEvent(e: any): void {
        const root = this.getContentDom();

        if(0 === root.innerHTML.length) {
            this.setContent('');
        }

        Editable.backupCurrentRange();

        this.event.fire('keyup', e);
        this.event.fire('selectionchange', e);
    }

    private handlerContentClickEvent(e: any): void {
        Editable.backupCurrentRange();

        this.event.fire('selectionchange', e);
    }

    private initEmptyContent(): string {
        const html = '<' + this.props.lineMode + '><br />'
            + '</' + this.props.lineMode + '>';

        return html;
    }

    private initPlugins(): void {
        if(null === this.props.plugins) {
            return;
        }

        if(null === this.pluginInstances) {
            this.pluginInstances = {};
        }

        const plugins: any = this.props.plugins;

        for(let name in plugins) {
            let Clazz = plugins[name].className;

            if(undefined === Clazz) {
                continue;
            }

            this.pluginInstances[name] = new Clazz(this, plugins[name].options);
        }
    }

    private renderWidgets(): JSX.Element[] | null {
        if(null === this.props.widgets) {
            return null;
        }

        const ret = [];

        for(let i=0,len=this.props.widgets.length; i<len; i++) {
            if('-' === this.props.widgets[i]) {
                ret.push(<i key={i} className="dy-editor-widgets-separator"/>);
                continue;
            }

            ret.push(
                React.createElement(this.props.widgets[i], {
                    key: i,
                    editor: this
                })
            );
        }

        return ret;
    }

    /**
     * 获取内容 dom 节点
     */
    public getContentDom(): any {
        const $wrapper = this.$wrapper.current;

        return $wrapper.querySelector(`[data-role="${Editor.ROLE_CONTENT}"]`);
    }

    /**
     * 获取挂件节点
     */
    public getWidgetsDom(): any {
        const $wrapper = this.$wrapper.current;

        return $wrapper.querySelector(`[data-role="${Editor.ROLE_WIDGETSBAR}"]`);
    }

    /**
     * 定位光标到内容最后一个节点
     *
     * @param {Boolean} toEnd 是否将光标定位到末尾
     */
    public resetRangeAtEndElement(toEnd?: boolean): void {
        if(undefined === toEnd) {
            toEnd = false;
        }

        const root = this.getContentDom();

        Editable.resetRangeAt(root.lastChild, toEnd);
    }

    /**
     * 设置内容
     *
     * @param {String} data
     */
    public setContent(data: string): void {
        const root = this.getContentDom();

        root.innerHTML = '' === data
            ? this.initEmptyContent()
            : data;

        this.resetRangeAtEndElement();
    }

    /**
     * 获取内容
     */
    public getContent(): string {
        const root = this.getContentDom();
        const tmp = root.innerHTML;

        // 去除多余空白
        return tmp.replace(/\u200B/g, '');
    }

    /**
     * 获取纯文本内容
     */
    public getPlainContent(): string {
        const ret = this.getContent();

        return Tools.filterTags(ret);
    }

    render() {
        return (
            <div ref={this.$wrapper} className="dy-editor-wrapper">
                <div data-role={Editor.ROLE_WIDGETSBAR} className="dy-editor-widgets-wrapper">
                    {this.renderWidgets()}
                </div>
                <div
                    contentEditable={true}
                    className={`dy-editor-content-wrapper ${this.props.contentClassName}`}
                    data-role={Editor.ROLE_CONTENT}
                    style={{ minHeight: this.props.minHeight + 'px' }}
                    dangerouslySetInnerHTML={{ __html: this.initEmptyContent() }}
                    ></div>
            </div>
        );
    }
}
