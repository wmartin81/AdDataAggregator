export function Menu(): JQuery {
    const template: string = "" + 
        `<div class='menu'>
            <div>All Ads</div>
            <div>Cover Ads</div>
            <div>Top 5 Ads</div>
            <div>Top 5 Brands</div>
        </div>`;

    return $(template);
}