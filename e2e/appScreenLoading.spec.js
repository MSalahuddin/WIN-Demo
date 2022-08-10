describe('Win_demo screens Loads properly', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Able to load the application', async () => {
    await expect(element(by.id('login-button'))).toBeVisible();
  });

  it('Able to start a free game', async () => {
    await expect(element(by.id('game-prizes-title-1'))).toBeVisible();
    await element(by.id('game-prizes-title-1')).tap();
    await expect(element(by.id('game-loaded'))).toBeVisible();
  });
});
