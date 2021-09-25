import {Sku} from "./sku";

class Cart {
    static SKU_MIN_COUNT = 1
    static SKU_MAX_COUNT = 1000
    static CART_ITEM_MAX_COUNT = 77
    static STORAGE_KEY = 'cart'
    _cartData = null


    static isSoldOut(item) {
        return item.skuId.stock === 0
    }

    static isOnLine(item) {
        return item.skuId.online
    }

    checkAll(checked) {
        const cartData = this._getCartData()
        cartData.items.forEach(e => {
            e.checked = checked
        })
        this._refreshStorage()
    }

    checkItem(skuId) {
        const oldItem = this.findEqualItem(skuId)
        oldItem.checked = !oldItem.checked
        this._refreshStorage()
    }

    getCheckedItems() {
        const cartItems = this._getCartData().items
        const checkedCartItems = []
        cartItems.forEach(item => {
            if (item.checked) {
                checkedCartItems.push(item)
            }
        })
        return checkedCartItems
    }

    replaceItemCount(skuId, newCount) {
        const oldItem = this.findEqualItem(skuId)
        if (!oldItem) {
            console.error('err1')
            return
        }
        if (newCount < 1) {
            console.error('err2')
            return
        }
        oldItem.count = newCount
        if (oldItem.count >= Cart.SKU_MAX_COUNT) {
            oldItem.count = Cart.SKU_MAX_COUNT
        }
        this._refreshStorage()
    }

    /**
     * 单例
     * @returns {Cart}
     */
    constructor() {
        if (typeof Cart.instance === 'object') {
            return Cart.instance
        }
        Cart.instance = this
        return this;
    }

    isAllChecked() {
        let allChecked = true
        const cartItems = this._getCartData().items
        for (let item of cartItems) {
            if (!item.checked) {
                allChecked = false
                break
            }
        }
        return allChecked
    }

    getCartItemCount() {
        return this._getCartData().items.length
    }

    isEmpty() {
        const cartData = this._getCartData()
        return cartData.items.length === 0;
    }

    addItem(newItem) {
        if (this.beyondMaxCartItemCount()) {
            throw new Error('满了')
        }
        this._pushItem(newItem)
        this._refreshStorage()
    }

    removeItem(skuId) {
        const oldItemIndex = this._findEqualItemIndex(skuId)
        const cartData = this._getCartData()
        cartData.items.splice(oldItemIndex, 1);
        this._refreshStorage()
    }

    getAllCartItemFromLocal() {
        return this._getCartData()
    }

    beyondMaxCartItemCount() {
        const cart = this._getCartData()
        return cart.items.length >= Cart.CART_ITEM_MAX_COUNT
    }

    _pushItem(newItem) {
        const cartData = this._getCartData()
        const oldItem = this.findEqualItem(newItem.skuId)
        if (!oldItem) {
            cartData.items.unshift(newItem)
        } else {
            this._combineItems(oldItem, newItem);
        }
    }

    async getAllSkuFromServer() {
        const cartData = this._getCartData();
        if (cartData.items.length === 0) {
            return null;
        }
        const skuIds = this.getSkuIds();
        const serverData = await Sku.getSkusByIds(skuIds);
        this._refreshByServerData(serverData);
        this._refreshStorage();
        return this._getCartData()
    }

    getSkuIds() {
        const cartData = this._getCartData();
        if (cartData.items.length !== 0) {
            return cartData.items.map(item => item.skuId.id);
        }
    }

    _getCartData() {
        if (this._cartData !== null) {
            return this._cartData
        }
        let cartData = wx.getStorageSync(Cart.STORAGE_KEY);
        if (!cartData) {
            cartData = this._initCartDataStorage()
        }
        this._cartData = cartData
        return cartData;
    }

    _initCartDataStorage() {
        const cartData = {
            items: []
        }
        wx.setStorageSync(Cart.STORAGE_KEY, cartData);
        return cartData
    }

    findEqualItem(skuId) {
        let oldItem = null
        const items = this._getCartData().items
        for (let i = 0; i < items.length; i++) {
            if (this._isEqualItem(items[i], skuId)) {
                oldItem = items[i]
                break
            }
        }
        return oldItem
    }

    _combineItems(oldItem, newItem) {
        this._plusCount(oldItem, newItem.count)
    }

    _plusCount(item, count) {
        item.count += count
        if (item.count >= Cart.SKU_MAX_COUNT) {
            item.count = Cart.SKU_MAX_COUNT
        }
    }

    _isEqualItem(item, skuId) {
        return item.skuId.id === skuId.id;
    }

    _refreshStorage() {
        wx.setStorageSync(Cart.STORAGE_KEY, this._cartData)
    }

    _findEqualItemIndex(skuId) {
        const cartData = this._getCartData()
        return cartData.items.findIndex(item => {
            return item.skuId === skuId
        })
    }

    _refreshByServerData(serverData) {
        const cartData = this._getCartData()
        cartData.items.forEach(item => {
            this._setLatestCartItem(item, serverData);
        })
    }

    _setLatestCartItem(item, serverData) {
        let removed = true
        for (let sku of serverData) {
            if (sku.id === item.skuId.id) {
                removed = false;
                item.skuId = sku;
                break;
            }
        }
        if (removed) {
            item.skuId.online = false;
        }

    }

    getCheckedSkuIds() {
        const cartData = this._getCartData()
        if (cartData.items.length === 0) {
            return []
        }
        const skuIds = []
        cartData.items.forEach(item => {
            if (item.checked) {
                skuIds.push(item.skuId)
            }
        })
        return skuIds

    }

    getSkuCountBySkuId(skuId) {
        const cartData = this._getCartData()
        const item = cartData.items.find(item => item.skuId === skuId)
        if (!item) {
            console.error('在订单里找不到')
        }
        return item.count;
    }


}

export {Cart}