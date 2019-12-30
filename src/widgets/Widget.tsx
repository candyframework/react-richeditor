import * as React from 'react';

import IWidget from './IWidget';
import WidgetProps from '../interfaces/WidgetProps';

/**
 * 挂件父类
 */
export default abstract class Widget extends React.Component<WidgetProps, any> implements IWidget {
    constructor(props: WidgetProps) {
        super(props);

        props.editor.event.on('selectionchange', this.beforeSelectionChange, this);
    }

    /**
     * @inheritdoc
     */
    public beforeSelectionChange(): void {
        // todo
        this.selectionChange();
        this.afterSelectionChange();
    }

    /**
     * @inheritdoc
     */
    public abstract selectionChange(): void;

    /**
     * @inheritdoc
     */
    public afterSelectionChange(): void {}
}
