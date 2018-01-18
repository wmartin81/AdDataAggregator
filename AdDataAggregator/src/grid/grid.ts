import { GridData } from './grid-data';
import { GridSort } from './grid-sort';
import { GridPager } from './grid-pager';

export class Grid {
    template: string = '' +
    `<div class='grid'>
        <div class='grid-title'>Please wait, loading for first time...</div>
        <div class='grid-content'>
            <table>
                <thead></thead>
                <tbody></tbody>
            </table>
        </div>
        <div class='grid-pager'></div>
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
        this.renderHeadersData(this.data.Headers);
    }

    renderBody() {
        this.pagination.isEnabled ? this.pagination.renderPage(1) : this.renderBodyData(this.data.Rows);
    }

    renderHeadersData(headers: string[]) {
        this.thead.empty();
        let tr = '' +
            `<tr>${headers.map((header) => {
                return (`<th data-key='${header}'>${header}</th>`)
            })}</tr>`;
        this.thead.append(tr);
    }

    renderBodyData(rows: object[]) {
        this.tbody.empty();
        let trs = '' +
            `${rows.map((row) => {
                return (`<tr>${Object.keys(row).map(key => `<td>${row[key]}</td>`)}</tr>`);
            })}`;
        this.tbody.append(trs);
    }
}