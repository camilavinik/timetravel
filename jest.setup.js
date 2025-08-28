/**
 * Jest Setup File
 * Contains all mocks used across test files
 */

// Mock libraries
jest.mock('expo-crypto', () => ({ randomUUID: jest.fn(() => 'mock-uuid-123') }));
jest.mock('expo-image-picker', () => ({ requestMediaLibraryPermissionsAsync: jest.fn(), launchImageLibraryAsync: jest.fn() }));
jest.mock('expo-file-system', () => ({ getInfoAsync: jest.fn() }));
jest.mock('expo-video-thumbnails', () => ({ getThumbnailAsync: jest.fn() }));
jest.mock('@react-native-community/datetimepicker', () => ({ value, onChange, ...props }) => {
  const MockedDateTimePicker = require('react-native').View;
  return <MockedDateTimePicker testID="date-time-picker" />;
});

// Workaround for act() warnings
// from: https://github.com/testing-library/react-testing-library/issues/459
const consoleError = console.error;
let mockConsoleError;
beforeAll(() => {
  mockConsoleError = jest.spyOn(console, 'error').mockImplementation((...args) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    if (
      message.includes('When testing, code that causes React state updates should be wrapped into act(...)') ||
      message.includes('antd')
    ) {
      return;
    }

    return consoleError.call(console, args);
  });
});

afterAll(() => {
  mockConsoleError.mockRestore();
});

// Mock Platform
global.Platform = {
  OS: 'ios',
  select: (obj) => obj.ios || obj.default,
};

// Mock navigation
const mockGoBack = jest.fn();
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock useFocusEffect
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: mockGoBack,
    navigate: mockNavigate,
  }),
  useFocusEffect: jest.fn((callback) => callback()),
}));

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

// Mock AuthContext
const mockLogout = jest.fn();
const mockChangePassword = jest.fn(() => Promise.resolve({ error: null }));

jest.mock('./lib/AuthContext', () => ({
  useAuthContext: () => ({
    register: jest.fn(),
    login: jest.fn(),
    loading: false,
    session: { user: { id: 'test-user-id' } },
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      created_at: '2025-08-22T00:00:00Z'
    },
    logout: mockLogout,
    changePassword: mockChangePassword,
  }),
}));

// Mock useCapsules hook
const mockGetCapsules = jest.fn(() => Promise.resolve([]));
const mockCreateCapsule = jest.fn(() => Promise.resolve());
const mockGetCapsuleContent = jest.fn();

jest.mock('./lib/useCapsules', () => ({
  __esModule: true,
  default: () => ({
    getCapsules: mockGetCapsules,
    getCapsulesLoading: false,
    getCapsulesError: null,
    createCapsule: mockCreateCapsule,
    isCreatingCapsule: false,
    getCapsuleContent: mockGetCapsuleContent,
    getCapsuleContentLoading: false,
    getCapsuleContentError: null,
  }),
}));

// Export mock functions
global.mockGetCapsules = mockGetCapsules;
global.mockCreateCapsule = mockCreateCapsule;
global.mockGetCapsuleContent = mockGetCapsuleContent;

global.mockGoBack = mockGoBack;
global.mockNavigate = mockNavigate;

global.mockLogout = mockLogout;
global.mockChangePassword = mockChangePassword;
