import { Grid, GridData } from './grid';
import { Menu } from './menu';
import { Proxy } from './proxy';

export class AppContent {
    template: string = '<div class="app-content"></div>';
    element: JQuery;
    constructor() {
        this.element = $(this.template);

        const proxy = new Proxy();

        const grid = new Grid();
        proxy.list().done((data: GridData) => {
            grid.sorting.enable();
            grid.pagination.enable();

            grid.bind(data)
                .updateTitle('All Ads')
                .render()
        });

        const menu = new Menu({
            onMenuItemClick: (menutItemId, text) => {
                proxy[menutItemId]().done((data: GridData) => {
                    if (['list', 'cover'].indexOf(menutItemId) > -1) {
                        grid.sorting.enable();
                        grid.pagination.enable();
                    }
                    else {
                        grid.sorting.disable();
                        grid.pagination.disable();
                    }

                    grid.bind(data)
                        .updateTitle(text)
                        .render()
                });
            }
        });

        this.element.append(menu.element)
            .append(grid.element);
    }
}
