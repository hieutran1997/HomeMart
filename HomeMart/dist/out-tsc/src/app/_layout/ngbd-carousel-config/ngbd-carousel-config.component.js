"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var operators_1 = require("rxjs/operators");
var http_1 = require("@angular/common/http");
var NgbdCarouselConfig = /** @class */ (function () {
    function NgbdCarouselConfig(config, _http) {
        this._http = _http;
        // customize default values of carousels used by this component tree
        config.interval = 10000;
        config.wrap = false;
        config.keyboard = false;
        config.pauseOnHover = false;
    }
    NgbdCarouselConfig.prototype.ngOnInit = function () {
        var _this = this;
        this._http.get('https://picsum.photos/list')
            .pipe(operators_1.map(function (images) { return _this._randomImageUrls(images); }))
            .subscribe(function (images) { return _this.images = images; });
    };
    NgbdCarouselConfig.prototype._randomImageUrls = function (images) {
        return [1, 2, 3, 4].map(function () {
            var randomId = images[Math.floor(Math.random() * images.length)].id;
            return "https://picsum.photos/1903/400?image=" + randomId;
        });
    };
    NgbdCarouselConfig = __decorate([
        core_1.Component({
            selector: 'app-ngbd-carousel-config',
            templateUrl: './ngbd-carousel-config.component.html',
            styles: [],
            providers: [ng_bootstrap_1.NgbCarouselConfig] // add NgbCarouselConfig to the component providers
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbCarouselConfig, http_1.HttpClient])
    ], NgbdCarouselConfig);
    return NgbdCarouselConfig;
}());
exports.NgbdCarouselConfig = NgbdCarouselConfig;
//# sourceMappingURL=ngbd-carousel-config.component.js.map