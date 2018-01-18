import { GridData } from './grid-data';

export class Grid {
    template: string = '' +
    `<div class='grid'>
        <table>
            <thead>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>`;

    element: JQuery;
    thead: JQuery;
    tbody: JQuery;
    data: GridData;

    constructor() {
        this.element = $(this.template);
        this.thead = this.element.find('thead');
        this.tbody = this.element.find('tbody');
    }

    bind(data: GridData) {
        this.data = data;
        return this;
    }

    render() {
        this.renderHeaders();
        this.renderBody();
    }

    renderHeaders() {
        this.thead.empty();
        let headers = '' +
            `<tr>${this.data.Headers.map((header) => {
                return (`<th data-key='${header}'>${header}</th>`)
            })}</tr>`;
        this.thead.append(headers);
    }

    renderBody() {
        this.tbody.empty();
        let rows = '' +
            `${this.data.Rows.map((row) => {
                return (`<tr>${Object.keys(row).map(key => `<td>${row[key]}</td>`)}</tr>`);
            })}`;
        this.tbody.append(rows);
    }

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

        this.data.Rows.sort(compare);
    }

    enableSort() {
        let self = this;
        this.thead.on('click', 'th', function () {
            let th = $(this);
            let key = th.data('key');
            let order = th.data('order');
            if (!order)
                order = 'asc'
            else
                order = order == 'asc' ? 'desc' : 'asc';

            th.data('order', order);
            self.sort(key, order);
            self.renderBody();
        });

        return this;
    }

    disableSort() {
        this.thead.off('click');
        return this;
    }
}