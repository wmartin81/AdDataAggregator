import { Grid } from './grid';

export class GridPager {
    template: string = '' +
    `<button class='prev-btn'>prev</button>
     <span class='current-page'>1</span>
     <button class='next-btn'>next</button>`;

    element: JQuery;
    prevBtn: JQuery;
    nextBtn: JQuery;
    currentPageSpan: JQuery;
    currentPage: number = 1;
    pageLimit: number = 50;
    get maxPages() { return Math.ceil(this.grid.data.Rows.length / this.pageLimit) };
    isEnabled: boolean = false;

    constructor(public grid: Grid) {
        this.element = grid.element.find('.grid-pager');
        this.element.append(this.template);
        this.prevBtn = this.element.find('.prev-btn');
        this.nextBtn = this.element.find('.next-btn');
        this.currentPageSpan = this.element.find('.current-page');
    }

    enable() {
        this.isEnabled = true;
        this.element.show();
        this.prevBtn.off('click').on('click', this.previous());
        this.nextBtn.off('click').on('click', this.next());
    }

    disable() {
        this.isEnabled = false;
        this.element.hide();
        this.prevBtn.off('click');
        this.nextBtn.off('click');
    }

    previous() {
        return () => {
            if (this.currentPage == 1) return;
            this.renderPage(this.currentPage - 1);
        };
    }

    next() {
        return () => {
            if (this.currentPage == this.maxPages) return;
            this.renderPage(this.currentPage + 1);
        };
    }

    updateCurrentPage(newPage: number) {
        this.currentPage = newPage;
        this.currentPageSpan.text(this.currentPage);
    }

    renderPage(page: number) {
        this.updateCurrentPage(page);

        let startIdx = (page - 1) * this.pageLimit;
        let endIdx = page == this.maxPages ? this.grid.data.Rows.length : page * this.pageLimit;
        let pageData = this.grid.data.Rows.slice(startIdx, endIdx);
        this.grid.renderBodyData(pageData);
    }
}