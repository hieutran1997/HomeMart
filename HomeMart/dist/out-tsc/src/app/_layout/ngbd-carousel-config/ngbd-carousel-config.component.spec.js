"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var ngbd_carousel_config_component_1 = require("./ngbd-carousel-config.component");
describe('NgbdCarouselConfigComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [ngbd_carousel_config_component_1.NgbdCarouselConfigComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(ngbd_carousel_config_component_1.NgbdCarouselConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=ngbd-carousel-config.component.spec.js.map