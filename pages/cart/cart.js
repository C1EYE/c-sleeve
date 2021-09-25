import {Cart} from "../../models/cart";
import {Calculator} from "../../models/calculator";

const cart = new Cart()
Component({
    properties: {},
    data: {
        isEmpty: false,
        cartItems: [],
        allChecked: false,
        totalPrice: 0,
        totalSkuCount: 0

    },
    methods: {
        onLoad: async function () {
            const cartData = await cart.getAllSkuFromServer();
            this.setData({
                cartItems: cartData.items
            })

        },
        onSingleCheck(event) {
            this.isAllChecked()
            this.refreshCartData()
        },

        onItemDelete(event) {
            this.isAllChecked()
            this.refreshCartData()
        },

        onShow: function () {
            const cart = new Cart()
            const cartItems = cart.getAllCartItemFromLocal();
            if (cart.isEmpty()) {
                this.empty()
                return
            }
            this.setData({
                cartItems: cartItems.items
            })
            this.notEmpty()
            this.isAllChecked()
            this.refreshCartData()
        },

        refreshCartData() {
            const cartItems = cart.getCheckedItems()
            const calculator = new Calculator(cartItems)
            calculator.calc()
            this.setCalcData(calculator)
        },

        onCountFloat() {
            this.refreshCartData()
        },

        setCalcData(calculator) {
            const totalPrice = calculator.getTotalPrice()
            const totalSkuCount = calculator.getTotalSkuCount()
            this.setData({
                totalPrice,
                totalSkuCount
            })
        },

        onCheckAll(event) {
            const checked = event.detail.checked
            cart.checkAll(checked)
            this.setData({
                cartItems: this.data.cartItems
            })
            this.refreshCartData()
        },

        isAllChecked() {
            const allChecked = cart.isAllChecked()
            this.setData({
                allChecked
            })
        },
        onSearch(event) {
            wx.navigateTo({
                url: '/page/category/category'
            })
        },
        empty() {
            this.setData({
                isEmpty: true
            })

            wx.hideTabBarRedDot({
                index: 2
            })
        },
        notEmpty() {
            wx.showTabBarRedDot({
                index: 2
            })
        },

        onSettle(event) {
            if (this.data.totalSkuCount <= 0) {
                return;
            }
            wx.navigateTo({
                url: '/pages/order/order'
            })
        }


    }
});
