import { withAlpha } from 'utils/colorUtils';

function createCustomShadow(palette, mode) {
  const baseColor = mode === 'dark' ? '#000000' : palette.grey[900];
  const transparent = withAlpha(baseColor, mode === 'dark' ? 0.4 : 0.24);
  const commonShadow = (color) => `0px 12px 14px 0px ${withAlpha(color, mode === 'dark' ? 0.45 : 0.3)}`;

  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z12: `0 12px 24px 0 ${transparent}, 0 10px 20px 0 ${transparent}`,
    z16: `0 0 3px 0 ${transparent}, 0 14px 28px -5px ${transparent}`,
    z20: `0 0 3px 0 ${transparent}, 0 18px 36px -5px ${transparent}`,
    z24: `0 0 6px 0 ${transparent}, 0 21px 44px 0 ${transparent}`,

    primary: commonShadow(palette.primary.main),
    secondary: commonShadow(palette.secondary.main),
    orange: commonShadow(palette.orange.main),
    success: commonShadow(palette.success.main),
    warning: commonShadow(palette.warning.main),
    error: commonShadow(palette.error.main)
  };
}

export default function CustomShadows(palette, mode) {
  return createCustomShadow(palette, mode);
}
