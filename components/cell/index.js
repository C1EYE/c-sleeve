Component({
    properties: {
        cell: Object,
        y: Number,
        x: Number

    },
    data: {},
    methods: {
        onTap(e) {
            this.triggerEvent('cellTap', {
                // 子组件 父组件
                cell: this.properties.cell,
                x: this.properties.x,
                y: this.properties.y
            }, {
                bubbles: true,
                composed: true
            })
        }
    }
});
