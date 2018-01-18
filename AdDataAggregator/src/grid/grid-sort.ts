import { Grid } from './grid';

export class GridSort {

    constructor(public grid: Grid) { }

    sort(key, order = 'asc') {
        const compare = (a, b) => {
            if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
                // property doesn't exist on either object
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ? (comparison * -1) : comparison
            );
        };

        this.grid.data.Rows.sort(compare);
    }

    enable() {
        let self = this;
        this.grid.thead.addClass('sortable');
        this.grid.thead.off('click').on('click', 'th', function () {
            let th = $(this);
            let key = th.data('key');
            let order = th.data('order');
            if (!order)
                order = 'asc'
            else
                order = order == 'asc' ? 'desc' : 'asc';

            th.data('order', order);
            self.sort(key, order);
            self.grid.renderBody();
        });

        return this;
    }

    disable() {
        this.grid.thead.removeClass('sortable');
        this.grid.thead.off('click');
        return this;
    }
}