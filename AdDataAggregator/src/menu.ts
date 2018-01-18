export class Menu {

    template: string = '' + 
        `<div class='menu'>
            <div data-item-id='list'>All Ads</div>
            <div data-item-id='cover'>Cover Ads</div>
            <div data-item-id='top5ads'>Top 5 Ads</div>
            <div data-item-id='top5brands'>Top 5 Brands</div>
        </div>`;

    element: JQuery;
    

    constructor(options?: MenuOptions) {
        this.element = $(this.template);
        this.element.on('click', 'div', function () {
            if (!options) return;
            if (!options.onMenuItemClick) return;

            let menuItemId = $(this).data('item-id');
            options.onMenuItemClick(menuItemId);
        });
    }
}

export class MenuOptions {
    onMenuItemClick: (menuItemId: string) => void;
}