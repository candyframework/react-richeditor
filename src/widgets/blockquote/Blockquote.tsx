import * as React from 'react';

import Widget from '../Widget';
import Editable from '../../Editable';

export default class Blockquote extends Widget {
    constructor(props: any) {
        super(props);

        this.state = {
            active: false
        };
    }

    /**
     * @inheritdoc
     */
    selectionChange() {
        const range = Editable.getCurrentRange();

        if(null === range) {
            return;
        }

        const blocked = range.currentInNode('blockquote');

        this.setState({
            active: blocked
        });
    }

    private getTopSegment(container: any, range: any): any {
        let blockquote = document.createElement('blockquote');
        let info = range.pathInfo();
        let startContainer = info[1];

        for(let i=0, len=container.childNodes.length; i<len; i++) {
            if(container.childNodes[i] !== startContainer) {
                blockquote.appendChild( container.childNodes[i].cloneNode(true) );
                continue;
            }
            break;
        }

        return blockquote;
    }

    private getBottomSegment(container: any, range: any): any {
        let blockquote = document.createElement('blockquote');
        let info = range.pathInfo(true);
        let endContainer = info[1];

        for(let i=container.childNodes.length-1; i>=0; i--) {
            if(container.childNodes[i] !== endContainer) {
                if(null === blockquote.firstChild) {
                    blockquote.appendChild( container.childNodes[i].cloneNode(true) );
                } else {
                    blockquote.insertBefore( container.childNodes[i].cloneNode(true), blockquote.firstChild );
                }
                continue;
            }
            break;
        }

        return blockquote;
    }

    private getCenterSegment(range: any): any[] {
        let ret = [];
        let info = range.pathInfo();
        let startContainer = info[1];

        info = range.pathInfo(true);
        let endContainer = info[1];

        let node = null;
        while(null !== startContainer) {
            node = startContainer.cloneNode(true);
            // #Text
            if(3 === node.nodeType) {
                let tmp = document.createElement('p');
                tmp.appendChild(node);

                node = tmp;
            }

            ret.push(node);

            if(startContainer === endContainer) {
                break;
            }

            startContainer = startContainer.nextSibling;
        }

        return ret;
    }

    toggleQuote = () => {
        const range = Editable.getCurrentRange();
        if(null === range) {
            return;
        }

        // 选区的开始节点
        // 以下都以这个节点为基础进行计算
        const container = range.getOutermostElement();
        if(null === container) {
            return;
        }

        let node = null;
        // 已经是引用状态
        if('BLOCKQUOTE' === container.nodeName.toUpperCase()) {
            let topBlockquote = this.getTopSegment(container, range);
            let bottomBlockquote = this.getBottomSegment(container, range);
            let centers = this.getCenterSegment(range);

            range.nativeRange.selectNode(container);
            range.nativeRange.deleteContents();

            if(topBlockquote.childNodes.length > 0) {
                range.nativeRange.insertNode(topBlockquote);
                range.nativeRange.collapse();
            }
            if(centers.length > 0) {
                for(let i=0, len=centers.length; i<len; i++) {
                    range.nativeRange.insertNode(centers[i]);
                    range.nativeRange.collapse();
                }
            }
            if(bottomBlockquote.childNodes.length > 0) {
                range.nativeRange.insertNode(bottomBlockquote);
                range.nativeRange.collapse();
            }

            Editable.resetRangeAt(centers[0].firstChild, true);

        } else {
            // 用 blockquote 将原内容包裹起来
            const cloneNode = container.cloneNode(true);
            node = document.createElement('blockquote');
            node.appendChild(cloneNode);

            container.parentNode.replaceChild(node, container);

            Editable.resetRangeAt(cloneNode.firstChild, true);
        }

        this.props.editor.event.fire('selectionchange');
    }

    render() {
        let activeClass = this.state.active ? 'active' : '';

        return (
            <span
                className={`dy-editor-icon dy-editor-icon-blockquote ${activeClass}`}
                onClick={this.toggleQuote}>
            </span>
        );
    }
}
