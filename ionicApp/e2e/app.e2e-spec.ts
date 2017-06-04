import { browser, element, by } from 'protractor';
import {} from 'jasmine';

describe('Findlunch', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('should have "FindLunch" title', () => {
    expect<any>(browser.getTitle()).toEqual('FindLunch');
  });
})
