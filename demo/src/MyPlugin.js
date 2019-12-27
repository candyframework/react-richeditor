/**
 * 滚动定位
 */
export default function ScrollFix(editor, options) {
    this.editor = editor;
    this.options = options;

    editor.event.on('ready', this.handler, this);
}
ScrollFix.prototype = {
    constructor: ScrollFix,
    getOffset: function(elem) {
        if ( !elem.getClientRects().length ) {
            return { top: 0, left: 0 };
        }

        let rect = elem.getBoundingClientRect();
        let doc = elem.ownerDocument;
        let docElem = doc.documentElement;
        let win = doc.defaultView;

        return {
            top: rect.top + win.pageYOffset - docElem.clientTop,
            left: rect.left + win.pageXOffset - docElem.clientLeft
        };
    },
    handler: function() {
        let _self = this;
        this.bar = this.editor.getWidgetsDom();
        this.barWidth = this.bar.clientWidth;
        this.barOffset = this.getOffset(this.bar);

        window.addEventListener('resize', function() {
            _self.barOffset = _self.getOffset(_self.bar);
        });
        window.addEventListener('scroll', function () {
            _self.scrollHandler();
        });
    },
    scrollHandler: function() {
        let navHeight = this.options.top;

        let startFixPos = this.barOffset.top - navHeight;

        if(document.documentElement) {
            if(document.documentElement.scrollTop > startFixPos) {
                this.bar.style.position = 'fixed';
                this.bar.style.zIndex = '100';
                this.bar.style.top = navHeight + 'px';
                this.bar.style.left = this.barOffset.left + 'px';
                this.bar.style.width = this.barWidth + 'px';

            } else {
                this.bar.removeAttribute('style');
            }
        }
    },
    destroy: function() {
        window.console.log(this.editor.event.$eventBinMap.ready.length);

        this.editor.event.off('ready', this.handler, this);

        window.console.log(this.editor.event.$eventBinMap.ready.length);
    }
};
