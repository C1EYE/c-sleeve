import {FenceGroup} from "../models/fence-group";
import {Judger} from "../models/judger";

Component({
    properties: {
        spu: Object,
    },
    data: {
        judger: Object
    },
    lifetimes: {
        attached() {
        }
    }
    ,
    methods: {
        bindInitData(fenceGroup) {
            this.setData({
                fences: fenceGroup.fences
            })
        },
        onCellTap(event) {
            const cell = event.detail.cell;
            const judger = this.data.judger;
            const x = event.detail.x;
            const y = event.detail.y;
            judger.judge(cell, x, y);
            this.setData({
                fences: judger.fenceGroup.fences
            })
        }
    },
    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            const fencesGroup = new FenceGroup(spu);
            fencesGroup.initFences2();
            this.data.judger = new Judger(fencesGroup);
            this.bindInitData(fencesGroup);
        }
    }
});
