"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var animations_1 = require("@angular/platform-browser/animations");
var layout_1 = require("@angular/cdk/layout");
var material_1 = require("@angular/material");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var layout_component_1 = require("./_layout/layout/layout.component");
var header_component_1 = require("./_layout/header/header.component");
var footer_component_1 = require("./_layout/footer/footer.component");
var home_component_1 = require("./_layout/home/home.component");
var ngbd_popover_config_component_1 = require("./_layout/ngbd-popover-config/ngbd-popover-config.component");
var ngbd_carousel_config_component_1 = require("./_layout/ngbd-carousel-config/ngbd-carousel-config.component");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var view_cart_detail_component_1 = require("./_layout/view-cart-detail/view-cart-detail.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                layout_component_1.LayoutComponent,
                header_component_1.HeaderComponent,
                footer_component_1.FooterComponent,
                home_component_1.HomeComponent,
                ngbd_popover_config_component_1.NgbdPopoverConfig,
                ngbd_carousel_config_component_1.NgbdCarouselConfig,
                view_cart_detail_component_1.ViewCartDetailComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                layout_1.LayoutModule,
                material_1.MatToolbarModule,
                material_1.MatButtonModule,
                material_1.MatSidenavModule,
                material_1.MatIconModule,
                material_1.MatListModule,
                material_1.MatCardModule,
                material_1.MatPaginatorModule,
                ng_bootstrap_1.NgbModule.forRoot(),
            ],
            providers: [ngx_cookie_service_1.CookieService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map