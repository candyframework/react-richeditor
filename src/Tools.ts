/**
 * 工具类
 */
export default class Tools {
    /**
     * 删除两端字符
     * @param {String} str 原始字符串
     * @param {String} character 要删除的字符
     */
    public static trimChar(str: string, character: string): string {
        if(character === str.charAt(0)) {
            str = str.substring(1);
        }
        if(character === str.charAt(str.length - 1)) {
            str = str.substring(0, str.length - 1);
        }

        return str;
    }

    /**
     * 首字母大写
     * @param {String} str 原始字符串
     */
    public static ucFirst(str: string): string {
        let ret = str.charAt(0).toUpperCase();

        return ret + str.substring(1);
    }

    /**
     * 过滤 html 标签
     * @param {String} str 原始字符串
     * @param {String} allowed 合法的标签
     *
     * ``` filterTags('<a>abc</a>xyz') -> abcxyz ```
     * ``` filterTags('<a>abc</a><i>xyz</i>', '<a><b>') -> <a>abc</a>xyz ```
     */
    public static filterTags(str: string, allowed: string = ''): string {
        const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
        const comments = /<!--[\s\S]*?-->/gi;

        str = str.replace(comments, '');

        if('' === allowed) {
            return str.replace(tags, '');
        }

        allowed = allowed.toLowerCase();

        return str.replace(tags, (match, p) => {
            return allowed.indexOf('<' + p.toLowerCase() + '>') !== -1 ? match : '';
        });
    }

    /**
     * 换行处理
     * @param {String} content 原始字符串
     */
    public static nl2br(content: string): string {
        const ret = content.replace(/(\015\012)\s*|(\015)\s*|(\012)\s*/g, '<br />');

        return ret;
    }
}
