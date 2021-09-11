Component({
    properties: {
        texts: Array
    },
    data: {
        _texts: Array
    },
    methods: {},
    observers: {
        'texts': function (texts) {
            this.setData({
                _texts: texts
            })
        }
    }

});
