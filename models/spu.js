import {Http} from "../utils/http";

class Spu {
    static getDetail(id) {
        return Http.request({
            url: `spu/id/${id}/detail`
        });
    }

    static isNoSpec(spu) {
        return spu.sku_list.length === 1 && spu.sku_list[0].specs.length === 0;

    }
}

export {
    Spu
}