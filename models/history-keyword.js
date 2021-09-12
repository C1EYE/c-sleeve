/**
 * 单例
 */
class HistoryKeyword {
    static MAX_ITEM_COUNT = 20
    static KEY = 'keywords'

    keywords = []

    constructor() {
        if (typeof HistoryKeyword.instance === 'object') {
            return HistoryKeyword.instance
        }
        this.keywords = this._loadLocalKeywords()
        HistoryKeyword.instance = this
        return this
    }

    save(keyword) {
        const items = this.keywords.filter(k => k === keyword)
        if (items.length !== 0) {
            return
        }

        if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
            this.keywords.pop()
        }
        this.keywords.unshift(keyword)
        this._refreshLocal()
    }

    get() {
        return this.keywords
    }

    clear() {
        this.keywords = []
        this._refreshLocal()
    }

    _refreshLocal() {
        wx.setStorageSync(HistoryKeyword.KEY, this.keywords)
    }

    _loadLocalKeywords() {
        const keywords = wx.getStorageSync(HistoryKeyword.KEY)
        if (!keywords) {
            wx.setStorageSync(HistoryKeyword.KEY, [])
            return []
        }
        return keywords
    }
}

export {HistoryKeyword}