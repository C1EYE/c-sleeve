import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

class Judger {
    fenceGroup
    pathDict = []
    skuPending

    constructor(fenceGroup) {
        this.fenceGroup = fenceGroup;
        this._initPathDict()
        this._initSkuPending();
    }

    isSkuIntact() {
        return this.skuPending.isIntact()
    }

    getCurrentValues() {
        return this.skuPending.getCurrentSpecValues()
    }

    getMissingKeys() {
        const missingKeysIndex = this.skuPending.getMissingSpecKeysIndex();
        return missingKeysIndex.map(e => {
            return this.fenceGroup.fences[e].title
        })

    }

    _initPathDict() {
        this.fenceGroup.spu.sku_list.forEach(s => {
            const skuCode = new SkuCode(s.code);
            this.pathDict.push(...skuCode.segments);
        })
    }

    _initSkuPending() {
        const specsLength = this.fenceGroup.fences.length;
        this.skuPending = new SkuPending(specsLength)
        const defaultSku = this.fenceGroup.getDefaultSku();
        if (!defaultSku) {
            return;
        }
        this.skuPending.init(defaultSku);
        this._initSelectedCell()
        this.judge(defaultSku)
    }

    _initSelectedCell() {
        this.skuPending.pending.forEach(cell => {
            this.fenceGroup.setCellStatusByID(cell.id, CellStatus.SELECTED)
        })
    }

    _isInDict(path) {
        return this.pathDict.includes(path);
    }

    judge(cell, x, y, isInit = false) {
        if (!isInit) {
            this._changeCurrentCellStatus(cell, x, y);
        }
        //更新潜在路径
        this.fenceGroup.eachCell((cell, x, y) => {
            const path = this._findPotentialPath(cell, x, y);
            if (!path) return;
            const isIn = this._isInDict(path);
            if (isIn) {
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
            } else {
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.FORBIDDEN)
            }
        })
    }

    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.SELECTED)
            this.skuPending.insertCell(cell, x)
        }
        if (cell.status === CellStatus.SELECTED) {
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
            this.skuPending.removeCell(x);
        }
        // if(cell.status === CellStatus.FORBIDDEN){
        //     //do nothing
        // }
    }


    _getCellCode(selected) {
        return selected.spec.key_id + '-' + selected.spec.value_id;
    }

    getDeterminateSku() {
        const code = this.skuPending.getSkuCode()
        const sku = this.fenceGroup.getSku(code)
        return sku;
    }

    //寻找每个cell潜在路径
    _findPotentialPath(cell, x, y) {
        const joiner = new Joiner('#')
        for (let i = 0; i < this.fenceGroup.fences.length; i++) {
            const selected = this.skuPending.findCellByX(i);
            if (x === i) {
                if (this.skuPending.isSelected(cell, x)) {
                    return
                }
                const cellCode = cell.getCellCode()
                joiner.join(cellCode);
            } else {
                if (selected) {
                    const selectedCellCode = this._getCellCode(selected);
                    joiner.join(selectedCellCode);
                }
            }
        }
        return joiner.getStr();
    }
}

export {
    Judger
}