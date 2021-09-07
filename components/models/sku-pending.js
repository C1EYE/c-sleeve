import {Cell} from "./cell";
import {Joiner} from "../../utils/joiner";

class SkuPending {
    pending = [];
    size;

    constructor(size) {
        this.size = size
    }

    init(sku) {
        for (let i = 0; i < sku.specs.length; i++) {
            const cell = new Cell(sku.specs[i]);
            this.insertCell(cell, i);
        }
    }

    /**
     * 判断是否已经选择所有sku
     */
    isIntact() {
        for (let i = 0; i < this.size; i++) {
            if (this._isEmptyPart(i)) {
                return false
            }
        }
        return true;
    }

    getSkuCode() {
        const joiner = new Joiner('#');
        this.pending.forEach(cell => {
            if (cell) {
                const cellCode = cell.getCellCode()
                joiner.join(cellCode)
            }
        })
        // console.log(joiner.getStr())
        return joiner.getStr();
    }

    /**
     * 返回当前规格值
     */
    getCurrentSpecValues() {
        let list = []

        this.pending.forEach(cell => {
            if (cell) {
                const cellVal = cell.title
                list.push(cellVal)
            }
        })
        return list
    }

    /**
     * 返回当前未选的规格名序号
     */
    getMissingSpecKeysIndex() {
        const index = []
        for (let i = 0; i < this.size; i++) {
            if (!this.pending[i]) {
                index.push(i)
            }
        }
        return index
    }

    _isEmptyPart(index) {
        return !this.pending[index];
    }

    insertCell(cell, x) {
        this.pending[x] = cell;
    }

    removeCell(x) {
        this.pending[x] = null;
    }

    findCellByX(x) {
        return this.pending[x];
    }

    isSelected(cell, x) {
        const pendingCell = this.pending[x]
        if (!pendingCell) {
            return false;
        }
        return cell.id === pendingCell.id
    }
}

export {
    SkuPending
}