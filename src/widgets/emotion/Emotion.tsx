import * as React from 'react';

import Widget from '../Widget';
import Editable from '../../Editable';

/**
 * 表情
 */
export default class Emotion extends Widget {
    /**
     * 配置列表
     */
    static options: any[] = [
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
        }
    ];

    constructor(props: any) {
        super(props);

        this.state = {
            showDialog: false,
            nowParagraph: '',
            selectedEmotionIndex: 0
        };
    }

    static globalEvent: any = null;

    componentDidMount() {
        Emotion.globalEvent = (e: any) => {
            if(-1 === e.target.className.indexOf('dy-editor-icon')) {
                this.setState({
                    showDialog: false
                });
            }
        }

        document.addEventListener('click', Emotion.globalEvent);
    }

    componentWillUnmount() {
        if(null !== Emotion.globalEvent) {
            document.removeEventListener('click', Emotion.globalEvent);
        }
    }

    /**
     * @inheritdoc
     */
    public selectionChange() {}

    openDialog = () => {
        this.setState({
            showDialog: true
        });
    }

    closeDialog = () => {
        this.setState({
            showDialog: false
        });
    }

    renderEmotions = () => {
        const emotion = Emotion.options[this.state.selectedEmotionIndex];
        const ret = [];

        if(!emotion) {
            return null;
        }

        const list = emotion.list;

        if('text' === emotion.packageType) {
            for(let i=0, len=list.length; i<len; i++) {
                ret.push(<span
                    key={list[i].title}
                    className="dy-editor-emotion-dialog-textitem"
                    title={list[i].title}
                    data-role="text_em"
                    data-value={list[i].value}>
                    {list[i].value}
                </span>);
            }
        } else {
            for(let i=0, len=list.length; i<len; i++) {
                ret.push(<span key={list[i].title} className="dy-editor-emotion-dialog-imageitem">
                    <img
                        src={list[i].value}
                        title={list[i].title}
                        data-role="image_em"
                        data-value={list[i].value}/>
                </span>);
            }
        }

        return ret;
    }

    insertEmotion = (e: any) => {
        e.stopPropagation();
        if(e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }

        const t = e.target;
        const role = t.getAttribute('data-role');
        const value = t.getAttribute('data-value');
        let ret = '';

        if('text_em' === role) {
            ret = value;

            Editable.resumeSelection();
            Editable.execCommand('insertHTML', false, ret);

            this.closeDialog();
            return;
        }

        if('image_em' === role) {
            ret = `<img src=${value} />`;

            Editable.resumeSelection();
            Editable.execCommand('insertHTML', false, ret);

            this.closeDialog();
            return;
        }
    }

    tabChange = (index: number) => {
        this.setState({
            selectedEmotionIndex: index
        })
    }

    makeTabs = () => {
        const list = Emotion.options;
        const ret = [];

        for(let i=0, len=list.length; i<len; i++) {
            ret.push(list[i].packageName)   ;
        }

        return ret;
    }

    render() {
        return (
            <section className="dy-editor-emotion-wrapper">
                <span
                    className={'dy-editor-icon dy-editor-icon-emotion'}
                    onClick={this.openDialog}></span>

                <div
                    style={{ display: this.state.showDialog ? 'block' : 'none' }}
                    className="dy-editor-emotion-dialog"
                    onClick={this.insertEmotion}>
                    <i className="dy-editor-triangle dy-editor-emotion-dialog-triangle"></i>
                    <div className="dy-editor-emotion-dialog-content">
                        {this.renderEmotions()}
                    </div>
                    <Tab items={this.makeTabs()} onChange={this.tabChange} />
                </div>
            </section>
        );
    }
}

class Tab extends React.Component<any> {
    static defaultProps = {
      items: [],
    };

    state: any;

    constructor(props: any) {
        super(props);

        this.state = {
            activeIndex: 0,
        };
    }

    renderItems() {
        const ret = [];
        const list = this.props.items;

        let activeClass = '';
        for(let i = 0, len = list.length; i < len; i += 1) {
            activeClass = i === this.state.activeIndex ? ' active' : '';
            ret.push(<span
                key={i}
                data-index={i}
                className={`dy-editor-tab-item${activeClass}`}>
                {list[i]}
            </span>);
        }

        return ret;
    }

    change = (e: any) => {
        const t = e.target;

        // 如果是链接 不走这里
        if('SPAN' !== t.nodeName.toUpperCase()) {
            return;
        }

        const index = parseInt(t.getAttribute('data-index'), 10);

        if(index === this.state.activeIndex) {
            return;
        }

        this.setState({
            activeIndex: index
        });

        if(this.props.onChange) {
            this.props.onChange(index);
        }
    };

    render() {
        return (
        <div className="dy-editor-tab-wrapper" onClick={this.change}>
            {this.renderItems()}
        </div>
        );
    }
  }
