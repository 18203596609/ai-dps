export class SwiperFun {
    constructor() { }
    curIndex = 0;
    updateSlidesPerView(swiper, num) {
        let slidesPerView = 0;
        swiper.params.slidesPerView = num;
        slidesPerView = num;
        this.update(swiper);
        return slidesPerView;
    }
    update(swiper) {
        swiper.update();
    }

    saveCurIndex(swiper) {
        this.curIndex = swiper.activeIndex;
        this.update(swiper);
    }

    getCurIndex(swiper) {
        this.update(swiper);
        return swiper.activeIndex;
    }

    setCurIndex(swiper) {
        setTimeout(() => {
            swiper.slideTo(this.curIndex, 0, false); // 切换到第一个slide，速度为1秒
            this.update(swiper);
        }, 0);
    }
}
