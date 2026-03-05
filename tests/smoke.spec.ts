import { expect, test, type Locator } from '@playwright/test';

const getTranslateX = async (locator: Locator) => {
  return locator.evaluate((node: Element) => {
    const transform = window.getComputedStyle(node).transform;
    if (!transform || transform === 'none') return 0;
    const matrix = new DOMMatrixReadOnly(transform);
    return matrix.m41;
  });
};

test('desktop loads core sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.locator('#portfolio')).toBeVisible();
  await expect(page.locator('#contact')).toBeVisible();
});

test('mobile menu opens and closes immediately', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');

  await page.goto('/');
  const menuToggle = page.getByTestId('nav-menu-toggle');
  await expect(menuToggle).toBeVisible();

  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');

  await menuToggle.click();
  await expect(menuToggle).toHaveAttribute('aria-expanded', 'false');
});

test('mobile services marquee responds to drag without breaking layout', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');

  await page.goto('/');
  await page.locator('#services').scrollIntoViewIfNeeded();

  const viewport = page.getByTestId('services-marquee-viewport');
  const track = page.getByTestId('services-marquee-track');
  await expect(viewport).toBeVisible();
  await expect(track).toBeVisible();

  const before = await getTranslateX(track);
  const box = await viewport.boundingBox();
  if (!box) throw new Error('Services marquee track has no bounding box');

  await viewport.evaluate((node, { startX, startY, endX, endY }) => {
    const createTouchEvent = (type: string, x: number, y: number) => {
      const event = new Event(type, { bubbles: true, cancelable: true });
      const touchPoint = { clientX: x, clientY: y };
      Object.defineProperty(event, 'touches', {
        value: type === 'touchend' ? [] : [touchPoint],
      });
      Object.defineProperty(event, 'changedTouches', {
        value: [touchPoint],
      });
      return event;
    };

    node.dispatchEvent(createTouchEvent('touchstart', startX, startY));
    window.dispatchEvent(createTouchEvent('touchmove', endX, endY));
    window.dispatchEvent(createTouchEvent('touchend', endX, endY));
  }, {
    startX: box.x + box.width / 2,
    startY: box.y + 24,
    endX: box.x + box.width / 2 - 120,
    endY: box.y + 24,
  });

  const after = await getTranslateX(track);
  expect(after).not.toBe(before);
});

test('mobile portfolio theater opens and closes explicitly', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile only');

  await page.goto('/');
  await page.locator('#portfolio').scrollIntoViewIfNeeded();

  const firstCard = page.locator('[data-reel-card="true"]').first();
  await expect(firstCard).toBeVisible();
  await firstCard.click();

  const theater = page.getByTestId('portfolio-theater');
  await expect(theater).toBeVisible();

  await page.getByTestId('portfolio-theater-close').click();
  await expect(theater).toBeHidden();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('reduced-motion mode keeps navigation usable', async ({ page, isMobile }) => {
    await page.goto('/');
    await expect(page.locator('#home')).toBeVisible();

    if (isMobile) {
      const menuToggle = page.getByTestId('nav-menu-toggle');
      await menuToggle.click();
      await expect(menuToggle).toHaveAttribute('aria-expanded', 'true');
    }
  });
});
