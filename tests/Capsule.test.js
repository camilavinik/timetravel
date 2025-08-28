import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Capsule from '../components/Capsule';
import {
  lockedCapsule,
  unlockedCapsule,
  capsuleContent,
  emptyCapsuleContent
} from './mocks/capsules';

describe('<Capsule />', () => {
  let renderedScreen;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Locked capsule', () => {
    beforeEach(() => {
      const route = { params: { capsule: lockedCapsule } };
      renderedScreen = render(<Capsule route={route} />);
    });

    test('it should match snapshot', () => {
      const snapshot = renderedScreen.toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    test('it renders locked capsule information', () => {
      const { getByText } = renderedScreen;

      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(getByText('This capsule is locked until')).toBeTruthy();
      expect(getByText('Dec 25, 2025')).toBeTruthy();
    });
  });

  describe('Unlocked capsule', () => {
    beforeEach(() => {
      global.mockGetCapsuleContent.mockResolvedValue(capsuleContent);
      const route = { params: { capsule: unlockedCapsule } };
      renderedScreen = render(<Capsule route={route} />);
    });

    test('it should match snapshot', async () => {
      const snapshot = renderedScreen.toJSON();
      expect(snapshot).toMatchSnapshot();
    });

    test('it renders unlocked capsule information', async () => {
      await waitFor(() => {
        const { getByText } = renderedScreen;

        expect(getByText('Unlocked Capsule 1')).toBeTruthy();
        expect(getByText('🎉')).toBeTruthy();
        expect(getByText('Created on Aug 10, 2025')).toBeTruthy();
        expect(getByText('Unlocked on Aug 20, 2025')).toBeTruthy();
      });
    });

    test('it renders messages when available', async () => {
      await waitFor(() => {
        const { getByText } = renderedScreen;

        expect(getByText('Your Messages')).toBeTruthy();
        expect(getByText('Test message number 1')).toBeTruthy();
        expect(getByText('Test message number 2')).toBeTruthy();
      });
    });

    test('it renders media gallery when available', async () => {
      await waitFor(() => {
        const { getByText } = renderedScreen;

        expect(getByText('Media Galery')).toBeTruthy();
        // Video
        expect(getByText('Video')).toBeTruthy();
        expect(getByText('5 MB • 00:30')).toBeTruthy();
        // Image
        expect(getByText('Image')).toBeTruthy();
        expect(getByText('2 MB')).toBeTruthy();
      });
    });

    test('it calls getCapsuleContent on mount', async () => {
      await waitFor(() => {
        expect(global.mockGetCapsuleContent).toHaveBeenCalledWith('unlocked-capsule-1');
      });
    });
  });

  describe('Unlocked capsule with no content', () => {
    beforeEach(() => {
      global.mockGetCapsuleContent.mockResolvedValue(emptyCapsuleContent);
      const route = { params: { capsule: unlockedCapsule } };
      renderedScreen = render(<Capsule route={route} />);
    });

    test('it does not render messages section when no messages', async () => {
      await waitFor(() => {
        const { queryByText } = renderedScreen;
        expect(queryByText('Your Messages')).toBeNull();
      });
    });

    test('it does not render media gallery section when no media', async () => {
      await waitFor(() => {
        const { queryByText } = renderedScreen;
        expect(queryByText('Media Galery')).toBeNull();
      });
    });
  });
});
