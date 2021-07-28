// pages/home/home.js
import {Theme} from "../../model/theme";
import {Banner} from "../../model/banner";
import {Category} from "../../model/category";
import {Activity} from "../../model/activity";
import {SpuPaging} from "../../model/spu-paging";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        themeA: null,
        themeE: null,
        themeF: null,
        themeH: null,
        bannerB: null,
        bannerG: null,
        grid: [],
        activityD: null,
        waterFlowData: null,
        spuPaging: null,
        loadingType: 'loading'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await this.initAllData();
        await this.initBottomSpuList();
    },

    async initBottomSpuList() {
        const paging = await SpuPaging.getLatestPaging();
        this.data.spuPaging = paging;
        const data = await paging.getMoreData();
        if (!data) {
            return
        }
        //加载第一页
        wx.lin.renderWaterFlow(data.items);
    },

    async initAllData() {
        const theme = new Theme();
        await theme.getThemes();
        const themeA = await theme.getHomeLocationA();
        const themeE = await theme.getHomeLocationE();
        const themeF = await theme.getHomeLocationF();
        const themeH = await theme.getHomeLocationH();
        let themeESpu = [];
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu();
            if (data) {
                themeESpu = data.spu_list.slice(0, 8)
            }
        }

        const bannerB = await Banner.getHomeLocationB();
        const bannerG = await Banner.getHomeLocationG();
        const grid = await Category.getHomeLocationsC();
        const activityD = await Activity.getHomeLocationD();
        this.setData({
            themeA,
            themeE,
            themeF,
            themeH,
            themeESpu,
            bannerB,
            bannerG,
            grid,
            activityD,
        });
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
        const data = await this.data.spuPaging.getMoreData();
        if (!data) {
            return
        }
        wx.lin.renderWaterFlow(data.items);
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})