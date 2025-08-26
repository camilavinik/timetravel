/**
 * Theme Configuration, Design System and Responsive Utilities
 * 
 * Defines the apps design including colors, typography, spacing, and responsive
 * sizing utilities. Uses a responsive scaling system based on iPhone 12/13/14 dimensions
 * with support for user font size preferences.
 * 
 * @exports {Object} colors, typography, margins, rsz function
 */

import { Dimensions, PixelRatio } from 'react-native'
const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

/** Responsive Size (rsz)
 * Calculates a responsive size based on the current screen height and user size settings.
 *
 * Uses 844 pixels as the reference screen height (e.g. iPhone 12/13/14), which represents a common design baseline as of 2025.
 * If the font parameter is true, the function will also scale the font size based on the user's font size settings.
 * A similar version of this function was also used in the midterm assignment
 * @param {number} fontSize - The base font size intended for the reference screen.
 * @param {boolean} font - Whether to scale the font size based on the user's font size settings.
 * @returns {number} - The adjusted font size for the current device.
 */
const rsz = (fontSize, font = false) => {
  const fontScale = font ? PixelRatio.getFontScale() : 1;

  const dimension = Math.max(screenWidth, screenHeight); // use width or height depending on the orientation
  const scaledSize = (fontSize * dimension) / 844; // 844 = screen height in logical pixels of iPhone 12/13/14

  return Math.round(PixelRatio.roundToNearestPixel(scaledSize)) * fontScale;
};

const colors = {
  primary: '#D97706',
  secondary: '#37474F',

  // Basic colors
  white: '#FFFFFF',
  dark: '#263238',
  gray: '#78909C',
  lightGray: '#ECEFF1',
  lightGray2: '#CFD8DC',

  // States
  error: '#F44336',
}

const fonts = {
  light: 'SpaceGrotesk_300Light',
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semiBold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
}

const typography = {
  title: {
    fontFamily: fonts.bold,
    fontSize: rsz(24, true),
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: rsz(18, true),
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: rsz(14, true),
  },
  inputLabel: {
    fontFamily: fonts.medium,
    fontSize: rsz(14, true),
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: rsz(16, true),
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: rsz(12, true),
  },
  labelBold: {
    fontFamily: fonts.bold,
    fontSize: rsz(12, true),
  },
  badge: {
    fontFamily: fonts.regular,
    fontSize: rsz(11, true),
  },
  badgeSmall: {
    fontFamily: fonts.semiBold,
    fontSize: rsz(10, true),
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: rsz(16, true),
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: rsz(11, true),
  },
}

const margins = {
  xxs: rsz(2),
  xs: rsz(4),
  sm: rsz(10),
  md: rsz(18),
  lg: rsz(32),
}

export { colors, typography, margins, rsz }