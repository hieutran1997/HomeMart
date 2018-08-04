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
var http_1 = require("@angular/common/http");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var cartModel_1 = require("../../model/cartModel");
var view_cart_service_1 = require("../view-cart.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(_http, cookieService, viewCartService) {
        this._http = _http;
        this.cookieService = cookieService;
        this.viewCartService = viewCartService;
        this.result = null;
        this.cookieValue = 'UNKNOWN';
        this.vattuSelected = null;
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.filterData(null);
        if (this.cookieService.check('vattutronggiohang')) {
            this.cookieValue = this.cookieService.get('vattutronggiohang');
            this.vattuSelected = JSON.parse(this.cookieValue);
            //this.cookieService.delete('vattutronggiohang');
        }
    };
    HomeComponent.prototype.filterData = function (event) {
        var _this = this;
        if (event) {
            this._http.get('http://localhost:50595/api/home/GetListMerchanedise?pagesize=' + event.pageSize + '&pagenumber=' + event.pageIndex)
                .subscribe(function (arr) {
                _this.result = arr;
                event.pageIndex = _this.result.PageNumber;
                event.pageSize = _this.result.PageSize;
                event.length = _this.result.ItemTotal;
                _this.lstVatTu = _this.result.Data;
                console.log(_this.lstVatTu);
            });
        }
        else {
            this._http.get('http://localhost:50595/api/home/GetListMerchanedise?pagesize=6&pagenumber=1')
                .subscribe(function (arr) {
                _this.result = arr;
                _this.lstVatTu = _this.result.Data;
                _this.pageIndex = _this.result.PageNumber;
                _this.pageSize = _this.result.PageSize;
                _this.length = _this.result.ItemTotal;
                console.log(_this.lstVatTu);
            });
        }
    };
    HomeComponent.prototype.getServerData = function (event) {
        console.log(event);
        this.filterData(event);
    };
    HomeComponent.prototype.display = function (item) {
        if (item.length > 15) {
            return item.substring(0, 15) + ' ...';
        }
        else {
            return item;
        }
    };
    HomeComponent.prototype.addToCart = function (item) {
        var lstVatTuCart = [];
        var vattu = null;
        vattu = item;
        vattu.SoLuong = 1;
        lstVatTuCart.push(vattu);
        if (this.vattuSelected) {
            var j = 0;
            if (this.vattuSelected.arrVatTuSelected) {
                for (var i = 0; i < this.vattuSelected.arrVatTuSelected.length; i++) {
                    if (this.vattuSelected.arrVatTuSelected[i].MaVatTu === vattu.MaVatTu) {
                        this.vattuSelected.arrVatTuSelected[i].SoLuong = this.vattuSelected.arrVatTuSelected[i].SoLuong + vattu.SoLuong;
                        this.vattuSelected.tongSoLuong += 1;
                        j++;
                    }
                }
            }
            if (j == 0) {
                this.vattuSelected.arrVatTuSelected.push(vattu);
                this.vattuSelected.tongSoLuong += vattu.SoLuong;
            }
            var tongtien = 0;
            for (var i = 0; i < this.vattuSelected.arrVatTuSelected.length; i++) {
                tongtien = tongtien + this.vattuSelected.arrVatTuSelected[i].SoLuong * this.vattuSelected.arrVatTuSelected[i].DonGia;
            }
            this.vattuSelected.tongTien = tongtien;
            this.cookieService.delete('vattutronggiohang');
            this.cookieService.set('vattutronggiohang', JSON.stringify(this.vattuSelected));
            this.viewCartService.changedCartView(this.vattuSelected);
        }
        else {
            this.vattuSelected = new cartModel_1.CartModel(lstVatTuCart, vattu.SoLuong, vattu.DonGia * vattu.SoLuong);
            this.vattuSelected.tongSoLuong = vattu.SoLuong;
            this.cookieService.set('vattutronggiohang', JSON.stringify(this.vattuSelected));
            this.viewCartService.changedCartView(this.vattuSelected);
        }
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrls: ['./home.component.css'],
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, ngx_cookie_service_1.CookieService, view_cart_service_1.ViewCartService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map