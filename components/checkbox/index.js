Component({
    properties: {
        checked: Boolean
    },
    data: {},
    methods: {
        onChecked(event) {
            let checked = this.properties.checked
            this.setData({
                checked: !this.properties.checked
            })
            this.triggerEvent('check', {
                checked: checked ? false : true
            }, {
                bubbles: true,
                composed: true
            })
        }
    }
});
