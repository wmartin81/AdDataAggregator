export class AppHeader {
    template: string = '' +
    `<div class="app-header">
        Ad Data Aggregator
    </div>`;

    element: JQuery;

    constructor() {
        this.element = $(this.template);
    }
}