import * as React from 'react';

import Widget from '../Widget';
import Editable from '../../Editable';

/**
 * 段落挂件
 */
export default class Paragraph extends Widget {
    /**
     * 段落配置
     */
    static options: any[] = [
        {
            title: '标题1',
            role: 'h1'
        },
        {
            title: '标题2',
            role: 'h2'
        },
        {
            title: '标题3',
            role: 'h3'
        }
    ];

    constructor(props: any) {
        super(props);

        this.state = {
            showDialog: false,
            nowParagraph: '',
        };
    }

    static globalEvent: any = null;

    componentDidMount() {
        Paragraph.globalEvent = (e: any) => {
            if(-1 === e.target.className.indexOf('dy-editor-icon')) {
                this.setState({
                    showDialog: false
                });
            }
        }

        document.addEventListener('click', Paragraph.globalEvent);
    }

    componentWillUnmount() {
        if(null !== Paragraph.globalEvent) {
            document.removeEventListener('click', Paragraph.globalEvent);
        }
    }

    /**
     * @inheritdoc
     */
    public selectionChange() {
        const ret = this.isStyled();

        this.setState({
            nowParagraph: ret.role
        });
    }

    isStyled = () => {
        const range = Editable.getCurrentRange();

        const ret = {
            styled: false,
            role: ''
        };

        if(null === range) {
            return ret;
        }

        for(let i=0, len=Paragraph.options.length; i<len; i++) {
            if(range.currentInNode(Paragraph.options[i].role)) {
                ret.styled = true;
                ret.role = Paragraph.options[i].role;
                break;
            }
        }

        return ret;
    }

    toggleDialog = () => {
        this.setState({
            showDialog: !this.state.showDialog
        });
    }

    setParagraph = (e: any) => {
        const t = e.target;

        const range = Editable.getCurrentRange();
        if(null === range) {
            return;
        }

        const role = t.getAttribute('data-role');

        let startNode: any = range.getOutermostElement();
        let endNode: any = range.getOutermostElement(true);
        if(null === startNode || null === endNode) {
            return;
        }

        // 如果最外层是 blockquote 那么以 blockquote 的子元素作为最外层
        if(startNode.nodeName.toUpperCase() === 'BLOCKQUOTE') {
            let pathStart = range.pathInfo().reverse();
            let pathEnd = range.pathInfo(true).reverse();

            startNode = pathStart[1];
            endNode = pathEnd[1];
        }

        const selectedNodes = [];
        selectedNodes.push(startNode);

        let tmpNode = startNode;
        while(tmpNode !== endNode && tmpNode.nextSibling) {
            selectedNodes.push(tmpNode.nextSibling)

            tmpNode = tmpNode.nextSibling;
        }

        let parentNode = startNode.parentNode;
        let newTag = null;
        let isStyled = this.isStyled().styled && this.state.nowParagraph === role;
        for(let i=0, len=selectedNodes.length, str=''; i<len; i++) {
            newTag = document.createElement(isStyled ? this.props.editor.props.lineMode : role);

            // 标题要去掉加粗标签 b strong
            str = selectedNodes[i].innerHTML;
            str = str.replace('<b>', '').replace('</b>', '').replace('<strong>', '').replace('</strong>', '');
            newTag.innerHTML = str;

            parentNode.replaceChild(newTag, selectedNodes[i]);
        }

        Editable.resetRangeAt(newTag, true);

        this.setState({
            nowParagraph: newTag.nodeName.toLowerCase()
        });
    }

    getList = () => {
        const ret = [];

        for(let i=0; i<Paragraph.options.length; i++) {
            let activeClass = this.state.nowParagraph === Paragraph.options[i].role ? 'active' : '';
            ret.push(<div
                key={i}
                className={`dy-editor-paragraph-dialog-item ${activeClass}`}
                data-role={Paragraph.options[i].role}>{Paragraph.options[i].title}</div>);
        }

        return ret;
    }

    render() {
        let activeClass = '' !== this.state.nowParagraph ? 'active' : '';

        return (
            <section className="dy-editor-paragraph-wrapper">
                <span
                    className={`dy-editor-icon dy-editor-icon-paragraph ${activeClass}`}
                    onClick={this.toggleDialog}></span>

                <div
                    onClick={this.setParagraph}
                    style={{ display: this.state.showDialog ? 'block' : 'none' }}
                    className="dy-editor-paragraph-dialog">
                    <i className="dy-editor-triangle dy-editor-paragraph-dialog-triangle"></i>
                    {this.getList()}
                </div>
            </section>
        );
    }
}
