import {accAdd, accMultiply} from "../utils/number";

class Calculator {
    getTotalPrice() {
        return this._totalPrice;
    }

    getTotalSkuCount() {
        return this._totalSkuCount;
    }


    _totalPrice = 0
    _totalSkuCount = 0

    constructor(cartItems) {
        this.cartItems = cartItems
    }

    init(cartItems) {
        cartItems.forEach(item => {
            this.push()
        })
    }

    calc() {
        this.cartItems.forEach(item => {
            this.push(item)
        })
    }

    push(cartItem) {
        let partTotalPrice = 0
        if (cartItem.skuId.discount_price) {
            partTotalPrice = accMultiply(cartItem.count, cartItem.skuId.price)
        } else {
            partTotalPrice = accMultiply(cartItem.count, cartItem.skuId.price)
        }
        this._totalPrice = accAdd(this._totalPrice, partTotalPrice)
        this._totalSkuCount += accAdd(this._totalPrice, cartItem.count)
    }

}

export {Calculator}