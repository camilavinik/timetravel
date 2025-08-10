const colors = {
  primary: '#D97706',
  secondary: '#37474F',
  
  // Basic colors
  white: '#FFFFFF',
  dark: '#263238',
  gray: '#78909C',
  lightGray: '#ECEFF1',

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
    fontSize: 24,
  },
  subtitle: {
    fontFamily: fonts.semiBold,
    fontSize: 18,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  inputLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
  body: {
    fontFamily: fonts.regular,
    fontSize: 16,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },
  badge: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  button: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 11,
  },
}

export { colors, typography }