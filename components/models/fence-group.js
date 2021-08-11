import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {
    spu
    skuList = []
    fences = []

    constructor(spu) {
        this.spu = spu;
        this.skuList = spu.sku_list;
    }

    initFences() {
        const matrix = this._createMatrix(this.skuList);
        const fences = [];
        let curr = -1;
        matrix.Each((element, i, j) => {
            //新的列
            if (curr !== j) {
                curr = j;
                //创建fence
                fences[j] = this._createFence(element);
            }
            fences[curr].pushValueTitle(element.value)
        })

    }

    initFences2() {
        const matrix = this._createMatrix(this.skuList);
        const fences = [];
        const AT = matrix.transpose();
        AT.forEach(row => {
            const fence = new Fence(row);
            fence.init();
            fences.push(fence);
        })
        this.fences = fences;

    }

    eachCell(callback) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j < this.fences[i].cells.length; j++) {
                const cell = this.fences[i].cells[j];
                callback(cell, i, j);
            }
        }
    }

    _createFence() {
        return new Fence();
    }

    _createMatrix(skuList) {
        const m = []
        skuList.forEach(sku => {
            m.push(sku.specs)
        })
        return new Matrix(m);
    }
}

export {
    FenceGroup
}