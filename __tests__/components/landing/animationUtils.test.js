import { getInputRangeFromIndexes, ferrisWheelScrollInterpolator } from '../../../js/components/landing/animationUtils';

describe('animationUtils', () => {
  test('animationUtils/getInputRangeFromIndexes', () => {
    expect(getInputRangeFromIndexes([1], 0, { itemWidth: 1 })).toStrictEqual([-1]);
    expect(getInputRangeFromIndexes([1, 2], 1, { itemWidth: 1 })).toStrictEqual([0, -1]);
  });

  test('animationUtils/ferrisWheelScrollInterpolator', () => {
    const animatedValue = 1;
    const carouselProps = {
      inactiveSlideOpacity: 0.5,
      inactiveSlideScale: 0.5
    };
    expect(ferrisWheelScrollInterpolator(null, animatedValue, carouselProps)).toStrictEqual({
      inputRange: [NaN, NaN, NaN],
      outputRange: [0, 1, 0]
    });
  });
});
