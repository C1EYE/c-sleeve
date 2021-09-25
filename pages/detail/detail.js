// pages/detail/detail.js
import {Spu} from "../../models/spu";
import {ShoppingWay} from "../../core/enum";
import {SaleExplain} from "../../models/sale-explain";
import {getWindowHeightRpx} from "../../utils/system";
import {Cart} from "../../models/cart";
import {CartItem} from "../../models/cart-item";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        spu: null,
        showRealm: Boolean
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const pid = options.pid;
        const spu = await Spu.getDetail(pid);
        const explain = await SaleExplain.getFixed()
        const windowHeight = await getWindowHeightRpx()
        const h = windowHeight - 100
        this.setData({
            spu,
            explain,
            h
        })
        this.updateCartItemCount()

    },
    onAddToCart(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.CART
        })
    },
    onBuy(event) {
        this.setData({
            showRealm: true,
            orderWay: ShoppingWay.BUY
        })
    },
    onGotoHome(event) {
        // 必须使用这个方法
        wx.switchTab({
            url: '/pages/home/home'
        })
    },

    onGotoCart(event) {
        wx.switchTab({
            url: '/pages/cart/cart'
        })
    },

    onSpecChange(event) {
        this.setData({
            specs: event.detail
        })
    },

    updateCartItemCount() {
        const cart = new Cart()
        this.setData({
            cartItemCount: cart.getCartItemCount(),
            showRealm: false
        })

    },

    onShopping(event) {
        const chosenSku = event.detail.sku;
        const skuCount = event.detail.skuCount
        const orderWay = event.detail.orderWay

        if (orderWay === ShoppingWay.CART) {
            const cart = new Cart()
            const cartItem = new CartItem(chosenSku, skuCount)
            cart.addItem(cartItem)
            this.updateCartItemCount()
        }
    }
})