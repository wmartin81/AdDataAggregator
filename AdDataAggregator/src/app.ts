import { Menu } from './menu';
import { Grid } from './grid';
import { GridData } from './grid-data';
import { Proxy } from './proxy';

const main = () => {
    const proxy = new Proxy();

    const grid = new Grid();
    proxy.list().done((data: GridData) => grid.render(data));

    const menu = new Menu({
        onMenuItemClick: (menutItemId) => {
            proxy.createJqXHR(menutItemId).done((data: GridData) => grid.render(data));
        }
    });

    $('#jquery-app')
        .append(menu.element)
        .append(grid.element);
}

$(main);
