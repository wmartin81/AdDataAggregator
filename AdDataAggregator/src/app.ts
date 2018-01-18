import { Menu } from './menu';
import { Grid } from './grid';
import { GridData } from './grid-data';
import { Proxy } from './proxy';

const main = () => {
    const proxy = new Proxy();

    const grid = new Grid();
    proxy.list().done((data: GridData) => {
        grid.bind(data)
            .enableSort()
            .render()
    });

    const menu = new Menu({
        onMenuItemClick: (menutItemId) => {
            proxy[menutItemId]().done((data: GridData) => {
                if (['list', 'cover'].indexOf(menutItemId) > -1)
                    grid.enableSort();
                else
                    grid.disableSort();

                grid.bind(data)
                    .render()
            });
        }
    });

    $('#jquery-app')
        .append(menu.element)
        .append(grid.element);
}

$(main);
