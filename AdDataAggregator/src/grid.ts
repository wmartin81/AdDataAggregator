import { GridData } from './grid-data';

export class Grid {
    template:string = '' +
        `<div class='grid'>
            <table>
                <thead>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>`;

    element: JQuery;

    constructor() {
        this.element = $(this.template);
    }

    render(data: GridData) {
        //append headers
        let thead = this.element.find('thead');
        thead.empty();
        let headers = `<tr>${data.Headers.map((header) => `<th>${header}</th>`)}</tr>`;
        thead.append(headers);

        //append rows
        let tbody = this.element.find('tbody');
        tbody.empty();
        let rows = `${data.Rows.map((row) => {
            return (`<tr>${Object.keys(row).map(key => `<td>${row[key]}</td>`)}</tr>`);
        })}`;
        tbody.append(rows);
    }
}