import * as React from 'react';

import IWidget from './IWidget';
import WidgetProps from '../interfaces/WidgetProps';

/**
 * 挂件父类
 */
export default abstract class Widget extends React.Component<WidgetProps, any> implements IWidget {
    constructor(props: WidgetProps) {
        super(props);

        props.editor.event.on('selectionchange', this.beforeStatusReflect, this);
    }

    /**
     * @inheritdoc
     */
    public beforeStatusReflect(): void {
        // todo
        this.statusReflect();
        this.afterStatusReflect();
    }

    /**
     * @inheritdoc
     */
    public abstract statusReflect(): void;

    /**
     * @inheritdoc
     */
    public afterStatusReflect(): void {}
}
