import {HistoryKeyword} from "../../models/history-keyword";
import {Tag} from "../../models/tag";
import {Search} from "../../models/search";
import {showToast} from "../../utils/ui";

const history = new HistoryKeyword()
Page({
    data: {
        paging: Object
    },
    onLoad: async function (options) {
        const historyTags = history.get()
        const hotTags = await Tag.getSearchTags()
        this.setData({
            historyTags,
            hotTags
        })
    },
    async onSearch(event) {
        const keyword = event.detail.value || event.detail.name
        if (!keyword) {
            showToast("请输入")
            return
        }
        this.setData({
            search: true,
            items: [],
        })
        const paging = Search.search(keyword)
        history.save(keyword)
        this.setData({
            historyTags: history.get(),
            paging

        })
        wx.lin.showLoading({
            color: "#157658",
            type: "flash",
            fullScreen: true
        })
        const data = await this.data.paging.getMoreData()
        wx.lin.hideLoading()
        this.bindItems(data)
    },
    bindItems(data) {
        if (data.accumulator.length !== 0) {
            this.setData({
                items: data.accumulator
            })
        }
    },
    onCancel(event) {
        this.setData({
            search: false
        })
    },
    onDelete() {
        history.clear()
        this.setData({
            historyTags: []
        })
    },
    onReachBottom: async function () {
        await this.data.paging.getMoreData();
        if (!this.data.paging.moreData) {
            this.setData({
                loadingType: 'end'
            })
        } else {
            this.bindItems(this.data.paging.accumulator)
            this.setData({
                loadingType: 'loading',
            })
        }

    },
});