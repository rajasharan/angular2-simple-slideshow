import { GmapsProjectPage } from './app.po';

describe('gmaps-project App', function() {
  let page: GmapsProjectPage;

  beforeEach(() => {
    page = new GmapsProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
