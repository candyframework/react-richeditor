import * as React from 'react';
import { render } from 'react-dom';

import Editor from '../../dist/index';
import Bold from '../../dist/widgets/bold/Bold';
import Italic from '../../dist/widgets/italic/Italic';
import Paragraph from '../../dist/widgets/paragraph/Paragraph';
import Blockquote from '../../dist/widgets/blockquote/Blockquote';
import Emotion from '../../dist/widgets/emotion/Emotion';
import '../../dist/index.css';

// 自定义
import ScrollFix from './MyPlugin.js';


Emotion.options = [
    {
        packageName: '默认',
        packageType: 'text',
        list: [
            { title: '高兴', value: '(^_^)' },
            { title: '发抖', value: '(＞﹏＜)' },
            { title: '加油', value: 'ᕦ(ò_óˇ)ᕤ' },
            { title: '惊讶', value: '(⊙ˍ⊙)' },
            { title: '无奈', value: '╮(╯＿╰)╭' },
            { title: '爱你', value: '(づ￣3￣)づ╭❤' },
            { title: '害怕', value: 'o((⊙﹏⊙))o' },
            { title: '哼', value: '(￣ヘ￣o)' },
            { title: '害羞', value: '(✿◡‿◡)' }
        ]
    },
    {
        packageName: '精选',
        packageType: 'image',
        list: [
            { title: '高兴1', value: 'https://img.douyucdn.cn/data/yuba/admin/2017/11/21/201711211200415676928355438.gif' }
        ]
    }
];

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
                    widgets={[Emotion, '-', Italic, Bold, Paragraph, Blockquote]}
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
