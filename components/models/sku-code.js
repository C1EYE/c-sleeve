import {combination} from "../../utils/util";

class SkuCode {

    code
    spuId
    //路径组合
    segments = []

    constructor(code) {
        this.code = code;
        this._splitToSegments();
    }

    _splitToSegments() {
        const spuAndSpec = this.code.split('$')
        this.spuId = spuAndSpec[0];

        const specCodeArray = spuAndSpec[1].split('#');
        const length = specCodeArray.length;
        for (let i = 1; i <= length; i++) {
            let seg = combination(specCodeArray, i);
            const newSegments = seg.map(s => {
                return s.join('#')
            })
            this.segments.push(...newSegments);
        }
    }
}

export {
    SkuCode
}