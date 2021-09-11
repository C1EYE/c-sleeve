Component({
    properties: {
        spu: Object
    },
    data: {
        tags: Array
    },
    methods: {},
    observers: {
        'spu': function (spu) {
            if (!spu) {
                return
            }
            if (!spu.tags) {
                return
            }
            const tags = spu.tags.split('$')
            this.setData({
                tags
            })
        }
    }

});
