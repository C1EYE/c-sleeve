import {Address} from "../../models/address";
import {AuthAddress} from "../../core/enum";

Component({
    properties: {},
    data: {
        address: null,
        hasChosen: false,
        showDialog: false
    },
    lifetimes: {
        attached() {
            const address = Address.getLocl();
            if (address) {
                this.setData({
                    address,
                    hasChosen: true
                })
            }
        }
    },
    methods: {
        async onChoseAddress() {
            const authStatus = await this.hasAuthorizedAddress()
            if (authStatus === AuthAddress.DENY) {
                this.setData({
                    showDialog: true
                })
                return
            }
            await this.getUserAddress()

        },
        async getUserAddress() {
            let res;
            try {
                res = await wx.chooseAddress({})
            } catch (e) {
                console.log(res)
            }
            if (res) {
                this.setData({
                    address: res,
                    hasChosen: true
                })
                Address.setLocal(res)
            }
        },
        onDialogConfirm() {
            wx.openSetting({})
        },

        async hasAuthorizedAddress() {
            const setting = await wx.getSetting({})
            const addressSetting = setting.authSetting['scope.address']
            if (addressSetting === undefined) {
                return AuthAddress.NOT_AUTH;
            } else if (addressSetting === false) {
                return AuthAddress.DENY
            } else {
                return AuthAddress.AUTHORIZED
            }
        }
    }
});
