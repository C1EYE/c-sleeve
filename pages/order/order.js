import {Cart} from "../../models/cart";
import {OrderItem} from "../../models/order-item";
import {Sku} from "../../models/sku";
import {Order} from "../../models/order";

const cart = new Cart()
Page({
    data: {},
    onLoad: function (options) {
        let orderItems;
        let localItemCount

        const skuIds = cart.getCheckedSkuIds()
        orderItems = this.getCartOrderItems(skuIds)
        localItemCount = skuIds.length;

        const order = new Order(orderItems, localItemCount)

        try {
            order.checkOrderIsOk()
        } catch (e) {
            console.error(e)
            this.setData({
                isOk: false
            })
            return
        }

    },
    async getCartOrderItems(skuIds) {
        const skus = await Sku.getSkusByIds(skuIds)
        const orderItems = this.packageOrderItems(skus)
        return orderItems
    },

    packageOrderItems(skuIds) {
        skuIds.map(sku => {
            const count = cart.getSkuCountBySkuId(skuIds)
            return new OrderItem(sku, count)
        })
    }
});