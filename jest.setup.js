/**
 * Jest Setup File
 * Contains all mocks used across test files
 */

// Mock navigation
const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Supabase client
jest.mock('./lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } }
      })),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
  },
}));

// Mock theme
jest.mock('./lib/theme', () => {
  const rsz = (fontSize, font = false) => fontSize;
  
  const colors = {
    primary: '#D97706',
    secondary: '#37474F',
    white: '#FFFFFF',
    dark: '#263238',
    gray: '#78909C',
    lightGray: '#ECEFF1',
    lightGray2: '#CFD8DC',
    error: '#F44336',
  };

  const fonts = {
    light: 'SpaceGrotesk_300Light',
    regular: 'SpaceGrotesk_400Regular',
    medium: 'SpaceGrotesk_500Medium',
    semiBold: 'SpaceGrotesk_600SemiBold',
    bold: 'SpaceGrotesk_700Bold',
  };

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
  };

  const margins = {
    xxs: rsz(2),
    xs: rsz(4),
    sm: rsz(10),
    md: rsz(18),
    lg: rsz(32),
  };

  return { colors, typography, margins, rsz };
});

// Export mock functions
global.mockGoBack = mockGoBack;
