import { Grid, GridData } from './grid';
import { Menu, MenuOptions } from './menu';
import { Proxy } from './proxy';

export class AppContent {
    template: string = '<div class="app-content"></div>';
    element: JQuery;
    proxy: Proxy;
    grid: Grid;
    menu: Menu;

    constructor() {
        this.element = $(this.template);

        this.proxy = new Proxy();
        this.grid = new Grid();
        this.menu = new Menu(this.createMenuOptions());

        this.element.append(this.menu.element)
            .append(this.grid.element);

        this.loadAllAdsIntoGrid();
    }

    createMenuOptions(): MenuOptions {
        const grid = this.grid;
        return {
            onMenuItemClick: (menutItemId, text) => {
                this.proxy[menutItemId]().done((data: GridData) => {
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
        }
    }

    loadAllAdsIntoGrid() {
        const grid = this.grid;

        this.proxy.list().done((data: GridData) => {
            grid.sorting.enable();
            grid.pagination.enable();

            grid.bind(data)
                .updateTitle('All Ads')
                .render()
        });
    }
}
