import { GridData } from './grid-data';
import { GridSort } from './grid-sort';
import { GridPager } from './grid-pager';

export class Grid {
    template: string = '' +
    `<div class='grid'>
        <div class='grid-title'></div>
        <div class='grid-content'>
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
    </div>`;

    element: JQuery;
    title: JQuery;
    thead: JQuery;
    tbody: JQuery;
    data: GridData;
    sorting: GridSort;
    pagination: GridPager;

    constructor() {
        this.element = $(this.template);
        this.title = this.element.find('.grid-title');
        this.thead = this.element.find('thead');
        this.tbody = this.element.find('tbody');
        this.sorting = new GridSort(this);
        this.pagination = new GridPager(this);
    }

    updateTitle(newTitle: string) {
        this.title.text(newTitle);
        return this;
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
}