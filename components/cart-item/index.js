import {parseSpecValue} from "../../utils/sku";
import {Cart} from "../../models/cart";

const cart = new Cart()
Component({
    properties: {
        cartItem: Object,

    },
    data: {
        specStr: String,
        discount: Boolean,
        soldOut: Boolean,
        online: Boolean,
        stock: Cart.SKU_MAX_COUNT,
        skuCount: 1
    },
    methods: {
        onDelete(event) {
            console.log('Del')
            const skuId = this.properties.cartItem.skuId.id
            cart.removeItem(skuId)
            this.setData({
                cartItem: null
            })
            this.triggerEvent('itemdelete', {})
        },
        checkedItem(event) {
            const checked = event.detail.checked
            cart.checkItem(this.properties.cartItem.skuId)
            this.properties.cartItem.checked = checked
            this.triggerEvent('itemcheck', {})
        },
        onSelectCount(event) {
            let newCount = event.detail.count
            console.log(newCount)
            cart.replaceItemCount(this.properties.cartItem.skuId, newCount)
            this.triggerEvent("countfloat", {})
        }

    },
    observers: {
        cartItem: function (cartItem) {
            if (!cartItem) {
                return
            }
            const specStr = parseSpecValue(cartItem.skuId.specs)
            const discount = cartItem.skuId.discount_price
            const soldOut = Cart.isSoldOut(cartItem)
            const online = Cart.isOnLine(cartItem)
            this.setData({
                specStr,
                discount,
                soldOut,
                online,
                stock: cartItem.skuId.stock,
                skuCount: cartItem.count
            })
        }
    }

});
