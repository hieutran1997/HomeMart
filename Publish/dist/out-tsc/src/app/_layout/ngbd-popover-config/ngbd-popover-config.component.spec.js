"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var ngbd_popover_config_component_1 = require("./ngbd-popover-config.component");
describe('NgbdPopoverConfig', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [ngbd_popover_config_component_1.NgbdPopoverConfig]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(ngbd_popover_config_component_1.NgbdPopoverConfig);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=ngbd-popover-config.component.spec.js.map