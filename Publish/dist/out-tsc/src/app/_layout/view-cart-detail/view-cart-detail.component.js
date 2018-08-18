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
var ngx_cookie_service_1 = require("ngx-cookie-service");
var ViewCartDetailComponent = /** @class */ (function () {
    function ViewCartDetailComponent(cookieService) {
        this.cookieService = cookieService;
        this.cookieValue = 'UNKNOWN';
        this.vattuSelected = null;
    }
    ViewCartDetailComponent.prototype.ngOnInit = function () {
        if (this.cookieService.check('vattutronggiohang')) {
            this.cookieValue = this.cookieService.get('vattutronggiohang');
            this.vattuSelected = JSON.parse(this.cookieValue);
            console.log(this.vattuSelected);
        }
    };
    ViewCartDetailComponent = __decorate([
        core_1.Component({
            selector: 'app-view-cart-detail',
            templateUrl: './view-cart-detail.component.html',
            styles: []
        }),
        __metadata("design:paramtypes", [ngx_cookie_service_1.CookieService])
    ], ViewCartDetailComponent);
    return ViewCartDetailComponent;
}());
exports.ViewCartDetailComponent = ViewCartDetailComponent;
//# sourceMappingURL=view-cart-detail.component.js.map