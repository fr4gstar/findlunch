"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
describe('Findlunch', function () {
    beforeEach(function () {
        protractor_1.browser.get('');
    });
    it('should have "FindLunch" title', function () {
        expect(protractor_1.browser.getTitle()).toEqual('FindLunch');
    });
});
