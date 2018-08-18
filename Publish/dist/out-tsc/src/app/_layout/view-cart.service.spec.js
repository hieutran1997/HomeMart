"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var view_cart_service_1 = require("./view-cart.service");
describe('ViewCartService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [view_cart_service_1.ViewCartService]
        });
    });
    it('should be created', testing_1.inject([view_cart_service_1.ViewCartService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=view-cart.service.spec.js.map