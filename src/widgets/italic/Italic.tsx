import * as React from 'react';

import Widget from '../Widget';
import Editable from '../../Editable';

/**
 * 斜体功能
 */
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
    public selectionChange() {
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
        let activeClass = this.state.active ? 'active' : '';

        return (
            <span
                className={`dy-editor-icon dy-editor-icon-italic ${activeClass}`}
                onClick={this.toggleItalic}></span>
        );
    }
}
