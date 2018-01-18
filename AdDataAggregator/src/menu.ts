export class Menu {

    template: string = '' + 
        `<div class='menu'>
            <div class='menu-item' data-item-id='list'>All Ads</div>
            <div class='menu-item' data-item-id='cover'>Cover Ads</div>
            <div class='menu-item' data-item-id='top5ads'>Top 5 Ads</div>
            <div class='menu-item' data-item-id='top5brands'>Top 5 Brands</div>
        </div>`;

    element: JQuery;
    

    constructor(options?: MenuOptions) {
        this.element = $(this.template);
        this.element.on('click', 'div', function () {
            if (!options) return;
            if (!options.onMenuItemClick) return;

            let div = $(this);
            let menuItemId = div.data('item-id');
            options.onMenuItemClick(menuItemId, div.text());
        });
    }
}

export class MenuOptions {
    onMenuItemClick: (menuItemId: string, text:string) => void;
}