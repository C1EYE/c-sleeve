import {promisifyAll} from 'miniprogram-api-promise';
import {Cart} from "./models/cart";

let jwx = {}
promisifyAll(wx, jwx)
wx = jwx
App({
    onLaunch() {
        const cart = new Cart()
        if (!cart.isEmpty()) {
            wx.showTabBarRedDot({
                index: 2
            })
        }
    },

})
