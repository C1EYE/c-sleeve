class CartItem {
    skuId = null
    count = 0
    sku = null
    checked = true


    constructor(skuId, count, sku) {
        this.skuId = skuId;
        this.count = count;
        this.sku = sku;
    }


}

export {CartItem}