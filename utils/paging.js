import {Http} from "./http";
import boolean from "../miniprogram_npm/lin-ui/common/async-validator/validator/boolean";

class Paging {

    start
    count
    req
    locker
    url
    moreData = true
    accumulator = []

    constructor(req, count = 10, start = 0) {
        this.start = start;
        this.count = count;
        this.req = req;
        this.url = req.url;
    }

    async getMoreData() {
        if (!this.moreData) {
            return;
        }
        if (!this._getLocker()) {
            return
        }
        const data = await this._actualGetData();
        this._releaseLocker();
        return data;
    }

    _accumulate(items) {
        this.accumulator = this.accumulator.concat(items)
    }

    /**
     * 判断是否还有数据
     * @param totalPage
     * @param pageNum
     * @returns {boolean}
     * @private
     */
    _moreData(totalPage, pageNum) {
        return pageNum < totalPage - 1;
    }

    /**
     * 处理req
     * @private
     */
    _getCurrentReq() {
        let url = this.url;
        const params = `start=${this.start}&count=${this.count}`
        if (url.includes('?')) {
            url += '&' + params;
        } else {
            url += '?' + params;
        }
        this.req.url = url;
        return this.req;

    }

    /**
     * 获取数据
     * @returns {{moreData: boolean, accumulator: [], items: [], empty: boolean}|null|{moreData: *, items: ([]|DataTransferItemList), empty: boolean}}
     * @private
     */
    async _actualGetData() {
        const req = this._getCurrentReq();
        let paging = await Http.request(req);
        if (!paging) {
            return null;
        }
        //empty
        if (paging.total === 0) {
            return {
                empty: true,
                items: [],
                moreData: false,
                accumulator: []
            }
        }
        //more?
        this.moreData = this._moreData(paging.total_page, paging.page);
        if (this.moreData) {
            this.start += this.count;
        }
        //addup
        this._accumulate(paging.items);
        //current data
        return {
            empty: false,
            items: paging.items,
            moreData: this.moreData,
            accumulator: this.accumulator
        }
    }

    _getLocker() {
        if (this.locker) {
            return false;
        }
        this.locker = true;
        return true;
    }

    _releaseLocker() {
        this.locker = false;
    }
}

export {Paging};