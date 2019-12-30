import * as React from 'react';

import Widget from '../Widget';
import Editable from '../../Editable';

export default class Bold extends Widget {
    constructor(props: any) {
        super(props);

        this.state = {
            active: false
        };
    }

    /**
     * @inheritdoc
     */
    public selectionChange() {
        const ret = Editable.queryCommandState('bold');

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

    toggleBold = () => {
        // 光标在拖动文字时 在编辑区外松开鼠标时不会保存选区，所以这里先保存下
        Editable.backupCurrentRange();
        Editable.execCommand('bold', false);

        this.props.editor.event.fire('selectionchange', null);
    }

    render() {
        let activeClass = this.state.active ? 'active' : '';

        return (
            <span
                className={`dy-editor-icon dy-editor-icon-bold ${activeClass}`}
                onClick={this.toggleBold}></span>
        );
    }
}
