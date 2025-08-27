import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import MyCapsules from '../components/MyCapsules';

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

  const mockedCapsules = [
    {
      id: 1,
      name: 'Mock Capsule 1 Locked',
      color: '#FFFAA0',
      icon: '☀️',
      unlockAt: 'Dec 25, 2025',
      createdAt: 'Aug 25, 2025',
      unlocked: false,
      daysLeftCount: 30,
      imageCount: 5,
      videoCount: 2,
      messageCount: 3
    },
    {
      id: 2,
      name: 'Mock Capsule 2 Unlocked',
      color: '#CAFFBF',
      icon: '🌊',
      unlockAt: 'Aug 25, 2025',
      createdAt: 'Aug 20, 2025',
      unlocked: true,
      daysLeftCount: 0,
      imageCount: 10,
      videoCount: 1,
      messageCount: 2
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.mockGetCapsules.mockResolvedValue(mockedCapsules);
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
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(getByText('Mock Capsule 2 Unlocked')).toBeTruthy();

      // Check if create button is rendered
      expect(getByText('Create Capsule')).toBeTruthy();
    });
  });

  test('it filters capsules by search query', async () => {
    const { getByPlaceholderText, getByText, queryByText } = renderedScreen;

    // Wait for capsules to be loaded
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(getByText('Mock Capsule 2 Unlocked')).toBeTruthy();
    });

    // Search for specific capsule
    const searchInput = getByPlaceholderText('Search capsule');
    act(() => {
      fireEvent.changeText(searchInput, '1');
    });

    // Should show only matching capsule
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(queryByText('Mock Capsule 2 Unlocked')).toBeNull();
    });

    // Search for non-existent capsule
    act(() => {
      fireEvent.changeText(searchInput, 'NonExistent');
    });

    // Should show no capsules found message
    await waitFor(() => {
      expect(getByText('No capsules found with "NonExistent"')).toBeTruthy();
      expect(queryByText('Mock Capsule 1 Locked')).toBeNull();
      expect(queryByText('Mock Capsule 2 Unlocked')).toBeNull();
    });
  });

  test('it filters capsules by status', async () => {
    const { getByText, queryByText } = renderedScreen;

    // Wait for capsules to be loaded
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(getByText('Mock Capsule 2 Unlocked')).toBeTruthy();
    });

    // Filter by Locked capsules
    const lockedFilter = getByText('Locked');
    act(() => {
      fireEvent.press(lockedFilter);
    });

    // Should show only locked capsules
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(queryByText('Mock Capsule 2 Unlocked')).toBeNull();
    });

    // Filter by Unlocked capsules
    const unlockedFilter = getByText('Unlocked');
    act(() => {
      fireEvent.press(unlockedFilter);
    });

    // Should show only unlocked capsules
    await waitFor(() => {
      expect(queryByText('Mock Capsule 1 Locked')).toBeNull();
      expect(getByText('Mock Capsule 2 Unlocked')).toBeTruthy();
    });

    // Filter by All capsules
    const allFilter = getByText('All');
    act(() => {
      fireEvent.press(allFilter);
    });

    // Should show all capsules
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
      expect(getByText('Mock Capsule 2 Unlocked')).toBeTruthy();
    });
  });

  test('it navigates to capsule when capsule is pressed', async () => {
    const { getByText } = renderedScreen;

    // Wait for capsule to be rendered
    await waitFor(() => {
      expect(getByText('Mock Capsule 1 Locked')).toBeTruthy();
    });

    // Press on a capsule
    act(() => {
      fireEvent.press(getByText('Mock Capsule 1 Locked'));
    });

    // Check if navigate function is called
    expect(global.mockNavigate).toHaveBeenCalledWith('Capsule', { capsule: mockedCapsules[0] });
  });
});
