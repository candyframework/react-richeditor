import * as React from 'react';
import { render } from 'react-dom';

import Editor from '../../src/index';
import Bold from '../../src/widgets/bold/Bold';
import Paragraph from '../../src/widgets/paragraph/Paragraph';
import Blockquote from '../../src/widgets/blockquote/Blockquote';
import '../../src/index.css';

// 自定义
import ScrollFix from './MyPlugin.js';
import Italic from './MyItalic';

export default class Index extends React.Component {
    editorRef: React.RefObject<Editor>;
    state: any;

    constructor(props: any) {
        super(props);

        this.editorRef = React.createRef();

        this.state = {
            show: true
        };
    }

    getContent = () => {
        if(this.editorRef.current) {
            let str = this.editorRef.current.getContent();
            window.console.log(str);
        }
    }

    destroy = () => {
        this.setState({
            show: false
        });
    }

    render() {

        if(!this.state.show) {
            return null;
        }

        return (
            <div>
                <Editor
                    ref={this.editorRef}
                    minHeight={200}
                    widgets={[Italic, Bold, Paragraph, Blockquote]}
                    plugins={{
                        scroll: {
                            className: ScrollFix,
                            // 可以给插件传入一些配置
                            options: {
                                top: 0
                            }
                        }
                    }}
                />
                <button type="button" onClick={this.getContent}>获取内容</button>
                <button type="button" onClick={this.destroy}>销毁</button>
            </div>
        );
    }
}

render(<Index />, window.document.getElementById('app'));
