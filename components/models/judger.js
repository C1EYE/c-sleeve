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

    _initPathDict() {
        this.fenceGroup.spu.sku_list.forEach(s => {
            const skuCode = new SkuCode(s.code);
            this.pathDict.push(...skuCode.segments);
        })
    }

    _initSkuPending() {
        this.skuPending = new SkuPending()
    }

    _isInDict(path) {
        return this.pathDict.includes(path);
    }

    judge(cell, x, y) {
        this._changeCurrentCellStatus(cell, x, y);
        //更新潜在路径
        this.fenceGroup.eachCell((cell, x, y) => {
            const path = this._findPotentialPath(cell, x, y);
            // console.log(path);
            if (!path) return;
            const isIn = this._isInDict(path);
            if (isIn) {
                this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING;
            } else {
                this.fenceGroup.fences[x].cells[y].status = CellStatus.FORBIDDEN;
            }
        })
    }

    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED;
            this.skuPending.insertCell(cell, x)
        }
        if (cell.status === CellStatus.SELECTED) {
            this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING;
            this.skuPending.removeCell(x);
        }
        // if(cell.status === CellStatus.FORBIDDEN){
        //     //do nothing
        // }
    }


    _getCellCode(selected) {
        return selected.spec.key_id + '-' + selected.spec.value_id;
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