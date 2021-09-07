import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";
import {Spu} from "../../models/spu";
import {Cell} from "../models/cell";

Component({
    properties: {
        spu: Object,
    },
    data: {
        judger: Object,
        previewImg: String,
        title: String,
        price: Number,
        discountPrice: Number,
        stock: Number,
        noSpec: Boolean,
        SkuIntact: Boolean
    },
    lifetimes: {
        attached() {
        }
    }
    ,
    methods: {
        processNoSPec(spu) {
            this.setData({
                noSpec: true,
            })
            this.bindSkuData(spu.sku_list[0])
        },
        processHasPec(spu) {
            const fencesGroup = new FenceGroup(spu);
            fencesGroup.initFences2();
            this.data.judger = new Judger(fencesGroup);
            //检查默认SKU
            const defaultSku = fencesGroup.getDefaultSku();
            if (defaultSku) {
                this.bindSkuData(defaultSku)
            } else {
                this.bindSpuData()
            }
            this.bindFenceGroupData(fencesGroup);
            this.bindTipData()
        },
        // bindInitData(fenceGroup) {
        //     this.setData({
        //         fences: fenceGroup.fences,
        //     })
        // },
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
                if (currentSku)
                    this.bindSkuData(currentSku)
            }
            this.bindTipData()
            this.bindFenceGroupData(judger.fenceGroup);
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
        }
    },
    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            // console.log(spu)
            if (Spu.isNoSpec(spu)) {
                this.processNoSPec(spu)
            } else {
                this.processHasPec(spu)
            }
        }
    }
});
