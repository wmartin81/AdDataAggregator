export class Proxy {
    adsBaseUrl = 'api/ads/';

    createJqXHR(adsApiAction: string): JQueryXHR {
        return $.getJSON(this.adsBaseUrl + adsApiAction);
    }

    /**
     * Get all ads sorted by brand name.
     */
    list() {
        return this.createJqXHR('list');
    }

    /**
     * Get Cover ads that take up 50% of the page or more, and are sorted by brand name.
     */
    cover() {
        return this.createJqXHR('cover');
    }

    /**
     * Get the top 5 ads with the highest page coverage amount.
     */
    top5ads() {
        return this.createJqXHR('top5ads');
    }

    /**
     * Get the top 5 brands with the highest page coverage amount
     */
    top5brands() {
        return this.createJqXHR('top5brands');
    }

}