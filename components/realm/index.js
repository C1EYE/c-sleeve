import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";
import {Spu} from "../../models/spu";
import {Cell} from "../models/cell";
import {Cart} from "../../models/cart";

Component({
    properties: {
        spu: Object,
        orderWay: String
    },
    data: {
        judger: Object,
        previewImg: String,
        title: String,
        price: Number,
        discountPrice: Number,
        stock: Number,
        noSpec: Boolean,
        SkuIntact: Boolean,
        currentSkuCount: Cart.SKU_MIN_COUNT,
        outStock: Boolean,
    },
    lifetimes: {

    }
    ,
    methods: {
        processNoSPec(spu) {

            this.setData({
                stock: spu.sku_list[0].stock,
                noSpec: true,
            })
            this.bindSkuData(spu.sku_list[0])
            this.setStockStatus(spu.sku_list[0].stock, this.data.currentSkuCount)
        },
        processHasPec(spu) {
            const fencesGroup = new FenceGroup(spu);
            fencesGroup.initFences2();
            this.data.judger = new Judger(fencesGroup);
            //检查默认SKU
            const defaultSku = fencesGroup.getDefaultSku();
            if (defaultSku) {
                this.bindSkuData(defaultSku)
                this.setStockStatus(defaultSku.stock, this.data.currentSkuCount)
            } else {
                this.bindSpuData()
            }
            this.bindFenceGroupData(fencesGroup);
            this.bindTipData()
        },
        bindFenceGroupData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },
        onCellTap(event) {
            const data = event.detail.cell;
            const judger = this.data.judger;
            const x = event.detail.x;
            const y = event.detail.y;
            const cell = new Cell(data.spec);
            cell.status = data.status;
            judger.judge(cell, x, y);
            const skuIntact = judger.isSkuIntact();
            if (skuIntact) {
                const currentSku = judger.getDeterminateSku()
                this.bindSkuData(currentSku)
                this.setStockStatus(currentSku.stock, this.data.currentSkuCount)
            }
            this.bindTipData()
            this.bindFenceGroupData(judger.fenceGroup);
            this.triggerSpecEvent()
        },
        bindSpuData() {
            const spu = this.properties.spu;
            this.setData({
                previewImg: spu.img,
                title: spu.title,
                price: spu.price,
                discountPrice: spu.discount_price,
            })
        },
        bindSkuData(sku) {
            this.setData({
                previewImg: sku.img,
                title: sku.title,
                price: sku.price,
                discountPrice: sku.discount_price,
                stock: sku.stock,
            })
        },
        bindTipData() {
            this.setData({
                SkuIntact: this.data.judger.isSkuIntact(),
                currentValues: this.data.judger.getCurrentValues(),
                missingKeys: this.data.judger.getMissingKeys()

            })
        },

        onSelectCount(event) {
            const currentCount = event.detail.count
            this.data.currentSkuCount = currentCount
            if (this.noSpec()) {
                this.setStockStatus(this.getNoSpecSku().stock, currentCount)
                return
            } else {
                if (this.data.judger.isSkuIntact()) {
                    const sku = this.data.judger.getDeterminateSku()
                    this.setStockStatus(sku.stock, currentCount)
                }
            }
        },

        triggerSpecEvent() {
            const noSpec = Spu.isNoSpec(this.properties.spu)
            if (noSpec) {
                this.triggerEvent('specchange', {
                    noSpec
                })
            } else {
                this.triggerEvent('specchange', {
                    noSpec: Spu.isNoSpec(this.properties.spu),
                    SkuIntact: this.data.judger.isSkuIntact(),
                    currentValues: this.data.judger.getCurrentValues(),
                    missingKeys: this.data.judger.getMissingKeys()
                })
            }
        },

        onBuyOrCart(event) {
            if (Spu.isNoSpec(this.properties.spu)) {
                this.shoppingNoSpec()
            } else {
                this.shoppingVarious()
            }
        },

        shoppingVarious() {
            const intact = this.data.judger.isSkuIntact()
            if (!intact) {
                const missKeys = this.data.judger.getMissingKeys()
                wx.showToast({
                    icon: "none",
                    title: `请选择:${missKeys.join(',')}`,
                    duration: 3000
                })
                return
            }
            this._triggerShoppingEvent(this.data.judger.getDeterminateSku())
        },

        shoppingNoSpec() {
            this._triggerShoppingEvent(this.getNoSpecSku())
        },

        getNoSpecSku() {
            return this.properties.spu.sku_list[0]
        },

        noSpec() {
            const spu = this.properties.spu
            return Spu.isNoSpec(spu);
        },

        _triggerShoppingEvent(sku) {
            this.triggerEvent('shopping', {
                orderWay: this.properties.orderWay,
                spuId: this.properties.spu.id,
                sku: sku,
                skuCount: this.data.currentSkuCount
            })
        },

        setStockStatus(stock, currentStock) {
            const setStock = this.isOutOfStock(stock, currentStock)
            this.setData({
                outStock: setStock
            })
        },

        isOutOfStock(stock, currentCount) {
            return stock < currentCount
        }
    },
    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            if (Spu.isNoSpec(spu)) {
                this.processNoSPec(spu)
            } else {
                this.processHasPec(spu)
            }
            this.triggerSpecEvent()
        }
    }
});
