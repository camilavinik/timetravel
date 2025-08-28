import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MyCapsules from '../components/MyCapsules';
import { lockedCapsule, unlockedCapsule } from './mocks/capsules';

describe('<MyCapsules /> without capsules', () => {
  let renderedScreen;
  const mockNavigation = {
    navigate: global.mockNavigate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = render(<MyCapsules navigation={mockNavigation} />);
  });

  test('it should match snapshot', () => {
    const snapshot = renderedScreen.toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  test('it renders MyCapsules empty state screen correctly', async () => {
    const { getByText } = renderedScreen;

    // Check if empty state messages are rendered
    expect(getByText("You don't have any capsules!")).toBeTruthy();
    expect(getByText('Create a new capsule to get started.')).toBeTruthy();

    // Check if create button is rendered
    expect(getByText('Create Capsule')).toBeTruthy();
  });

  test('it navigates to CreateCapsule when Create Capsule button is pressed', () => {
    const { getByText } = renderedScreen;
    const createButton = getByText('Create Capsule');
    fireEvent.press(createButton);

    // Check if navigate function is called
    expect(global.mockNavigate).toHaveBeenCalledWith('CreateCapsule');
  });
});

describe('<MyCapsules /> with capsules', () => {
  let renderedScreen;

  beforeEach(() => {
    jest.clearAllMocks();
    global.mockGetCapsules.mockResolvedValue([lockedCapsule, unlockedCapsule]);
    renderedScreen = render(<MyCapsules navigation={{ navigate: global.mockNavigate }} />);
  });

  test('it renders MyCapsules with capsules', async () => {
    const { getByText, getByPlaceholderText } = renderedScreen;

    // Wait for async operations to complete
    await waitFor(() => {
      // Check if search input is rendered
      expect(getByPlaceholderText('Search capsule')).toBeTruthy();

      // Check if filter buttons are rendered
      expect(getByText('All')).toBeTruthy();
      expect(getByText('Locked')).toBeTruthy();
      expect(getByText('Unlocked')).toBeTruthy();

      // Check if capsules are rendered
      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(getByText('Unlocked Capsule 1')).toBeTruthy();

      // Check if create button is rendered
      expect(getByText('Create Capsule')).toBeTruthy();
    });
  });

  test('it filters capsules by search query', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderedScreen;

    // Wait for capsules to be loaded
    await waitFor(() => {
      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(getByText('Unlocked Capsule 1')).toBeTruthy();
    });

    // Search for specific capsule
    const searchInput = getByPlaceholderText('Search capsule');
    act(() => {
      fireEvent.changeText(searchInput, 'Unlocked');
    });

    // Should show only matching capsule
    await waitFor(() => {
      const lockedElement = queryByText('Locked Capsule 1');
      const unlockedElement = queryByText('Unlocked Capsule 1');
      expect(unlockedElement).toBeTruthy();
      expect(lockedElement).toBeNull();
    }, { timeout: 3000 });

    // Search for non-existent capsule
    act(() => {
      fireEvent.changeText(searchInput, 'NonExistent');
    });

    // Should show no capsules found message
    await waitFor(() => {
      expect(getByText('No capsules found with "NonExistent"')).toBeTruthy();
      expect(queryByText('Locked Capsule 1')).toBeNull();
      expect(queryByText('Unlocked Capsule 1')).toBeNull();
    });
  });

  test('it filters capsules by status', async () => {
    const { getByText, queryByText } = renderedScreen;

    // Wait for capsules to be loaded
    await waitFor(() => {
      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(getByText('Unlocked Capsule 1')).toBeTruthy();
    });

    // Filter by Locked capsules
    const lockedFilter = getByText('Locked');
    act(() => {
      fireEvent.press(lockedFilter);
    });

    // Should show only locked capsules
    await waitFor(() => {
      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(queryByText('Unlocked Capsule 1')).toBeNull();
    });

    // Filter by Unlocked capsules
    const unlockedFilter = getByText('Unlocked');
    act(() => {
      fireEvent.press(unlockedFilter);
    });

    // Should show only unlocked capsules
    await waitFor(() => {
      expect(queryByText('Locked Capsule 1')).toBeNull();
      expect(getByText('Unlocked Capsule 1')).toBeTruthy();
    });

    // Filter by All capsules
    const allFilter = getByText('All');
    act(() => {
      fireEvent.press(allFilter);
    });

    // Should show all capsules
    await waitFor(() => {
      expect(getByText('Locked Capsule 1')).toBeTruthy();
      expect(getByText('Unlocked Capsule 1')).toBeTruthy();
    });
  });

  test('it navigates to capsule when capsule is pressed', async () => {
    const { getByText } = renderedScreen;

    // Wait for capsule to be rendered
    await waitFor(() => {
      expect(getByText('Locked Capsule 1')).toBeTruthy();
    });

    // Press on a capsule
    act(() => {
      fireEvent.press(getByText('Locked Capsule 1'));
    });

    // Check if navigate function is called
    expect(global.mockNavigate).toHaveBeenCalledWith('Capsule', { capsule: lockedCapsule });
  });
});
