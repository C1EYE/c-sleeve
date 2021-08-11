class Matrix {
    m

    constructor(martix) {
        this.m = martix;
    }

    getRowsNum() {
        return this.m.length;
    }

    getColsNum() {
        return this.m[0].length;
    }

    Each(cb) {
        //先遍历列
        for (let k = 0; k < this.getColsNum(); k++) {
            for (let l = 0; l < this.getRowsNum(); l++) {
                const element = this.m[l][k];
                cb(element, l, k);
            }
        }
    }

    //转置
    transpose() {
        const desArr = [];
        for (let col = 0; col < this.getColsNum(); col++) {
            desArr[col] = [];
            for (let row = 0; row < this.getRowsNum(); row++) {
                desArr[col][row] = this.m[row][col];
            }
        }
        return desArr;
    }
}

export {
    Matrix
}