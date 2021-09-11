import {ShoppingWay} from "../../core/enum";

Component({
    properties: {
        orderWay: String,

    },
    data: {},
    methods: {
        onGoToHome(event) {
            this.triggerEvent('gotohome', {})
        },
        onGoToCart(event) {
            this.triggerEvent('gotocart', {})
        },
        onAddToCart(event) {
            this.setData({
                showRealm: true,
                orderWay: ShoppingWay.CART
            })
            this.triggerEvent('addtocart')
        },
        onBuy(event) {
            this.triggerEvent('buy')
        }

    }
});