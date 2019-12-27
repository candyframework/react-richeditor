import * as React from 'react';

import { Widget }  from '../../dist/index';
import {Editable} from '../../dist/index';

export default class Italic extends Widget {
    state: any;

    constructor(props: any) {
        super(props);

        this.state = {
            active: false
        };
    }

    /**
     * @inheritdoc
     */
    public statusReflect() {
        const ret = Editable.queryCommandState('italic');

        if(true === ret) {
            this.setState({
                active: true
            });

            return;
        }

        this.setState({
            active: false
        });
    }

    toggleItalic = () => {
        Editable.backupCurrentRange();
        Editable.execCommand('italic', false);

        this.props.editor.event.fire('selectionchange', null);
    }

    render() {
        // 这里为了举例 没使用 css 文件
        // 最好使用 css 文件来存储样式
        let style: any = {
            display: 'inline-block',
            width: '30px',
            height: '30px',
            lineHeight: '30px',
            margin: '0 5px',
            verticalAlign: 'top',
            cursor: 'default',
            textAlign: 'center'
        };
        if(this.state.active) {
            style.backgroundColor = '#ddd';
        }

        return (
            <span
                style={ style }
                onClick={this.toggleItalic}>斜</span>
        );
    }
}
