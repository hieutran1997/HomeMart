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
var view_cart_service_1 = require("../view-cart.service");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var NgbdPopoverConfig = /** @class */ (function () {
    function NgbdPopoverConfig(config, viewCartService, cookieService) {
        this.viewCartService = viewCartService;
        this.cookieService = cookieService;
        this.cookieValue = 'UNKNOWN';
        this.titleCart = '';
        this.contentCart = '';
        this.vattuSelected = null;
        // customize default values of popovers used by this component tree
        config.placement = 'bottom';
        config.triggers = 'hover';
    }
    NgbdPopoverConfig.prototype.ngOnInit = function () {
        var _this = this;
        if (this.cookieService.check('vattutronggiohang')) {
            this.cookieValue = this.cookieService.get('vattutronggiohang');
            this.vattuSelected = JSON.parse(this.cookieValue);
            //this.cookieService.delete('vattutronggiohang');
            this.quantity = this.vattuSelected.tongSoLuong;
            this.titleCart = 'Có tất cả : ' + this.quantity + ' mặt hàng';
            var content = '';
        }
        this.viewCartService.changeCart.subscribe(function (data) {
            _this.quantity = data.tongSoLuong;
            _this.vattuSelected = data;
            _this.titleCart = 'Có tất cả : ' + _this.quantity + ' mặt hàng';
            var content = '';
        });
    };
    NgbdPopoverConfig = __decorate([
        core_1.Component({
            selector: 'app-ngbd-popover-config',
            templateUrl: './ngbd-popover-config.component.html',
            styles: [],
            providers: [ng_bootstrap_1.NgbPopoverConfig] // add NgbPopoverConfig to the component providers
        }),
        __metadata("design:paramtypes", [ng_bootstrap_1.NgbPopoverConfig, view_cart_service_1.ViewCartService, ngx_cookie_service_1.CookieService])
    ], NgbdPopoverConfig);
    return NgbdPopoverConfig;
}());
exports.NgbdPopoverConfig = NgbdPopoverConfig;
//# sourceMappingURL=ngbd-popover-config.component.js.map