import { render, fireEvent } from '@testing-library/react-native';
import CreateCapsule from '../components/CreateCapsule';
import { suggestedIcons } from '../components/CreateCapsule/IconChooser';
import { suggestedColors } from '../components/CreateCapsule/ColorChooser';

describe('<CreateCapsule />', () => {
  let renderedScreen;
  const mockNavigation = {
    goBack: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = render(<CreateCapsule navigation={mockNavigation} />);
  });

  test('it renders CreateCapsule screen with all sections', () => {
    const { getByText, getByTestId } = renderedScreen;

    // Check sections
    expect(getByText('Capsule Design')).toBeTruthy();
    expect(getByText('Choose an icon, color, and name for your capsule.')).toBeTruthy();
    expect(getByText('Your Messages')).toBeTruthy();
    expect(getByText('Add one or more messages.')).toBeTruthy();
    expect(getByText('Add Media')).toBeTruthy();
    expect(getByText('Upload photos, videos, or both.')).toBeTruthy();
    expect(getByText('Unlock Date')).toBeTruthy();
    expect(getByText('When should this capsule open?')).toBeTruthy();
    expect(getByTestId('create-capsule-button')).toBeTruthy();
  });

  test('it renders icon chooser with suggested icons', () => {
    const { getByText, getByTestId } = renderedScreen;

    expect(getByText('Choose Icon')).toBeTruthy();

    // Check all icons
    suggestedIcons.forEach(icon => {
      const iconElement = getByTestId(`icon-option-${icon}`);
      expect(iconElement).toBeTruthy();
    });
  });

  test('it renders color chooser with suggested colors', () => {
    const { getByText, getByTestId } = renderedScreen;

    expect(getByText('Choose Color')).toBeTruthy();

    // Check all colors
    suggestedColors.forEach(color => {
      const colorElement = getByTestId(`color-option-${color}`);
      expect(colorElement).toBeTruthy();
    });
  });

  test('it updates capsule name when input changes', () => {
    const { getByTestId } = renderedScreen;

    const nameInput = getByTestId('capsule-name-input');

    fireEvent.changeText(nameInput, 'My Test Capsule');

    expect(nameInput.props.value).toBe('My Test Capsule');
  });

  test('it adds and removes messages', () => {
    const { queryByText, getByTestId, queryByTestId } = renderedScreen;

    // Initially no messages
    expect(queryByText('Message 1')).toBeNull();

    // Add a message
    const addMessageButton = getByTestId('add-message-button');
    fireEvent.press(addMessageButton);

    // Should show message input
    expect(queryByText('Message 1')).toBeTruthy();
    expect(getByTestId('message-input-1')).toBeTruthy();

    // Remove the message
    const deleteMessageButton = getByTestId('delete-message-1');
    fireEvent.press(deleteMessageButton);

    // Should no longer show message input
    expect(queryByText('Message 1')).toBeNull();
    expect(queryByTestId('message-input-1')).toBeNull();
  });

  test('it disables create button when form is incomplete', () => {
    const { getByTestId } = renderedScreen;

    // Get the button element
    const createButton = getByTestId('create-capsule-button');
    expect(createButton).toBeTruthy();

    fireEvent.press(createButton);

    // Verify function was not called
    expect(global.mockCreateCapsule).not.toHaveBeenCalled();
    expect(mockNavigation.goBack).not.toHaveBeenCalled();
  });

  test('it enables create button when form is complete', async () => {
    const { getByTestId } = renderedScreen;

    // Fill the name input
    const nameInput = getByTestId('capsule-name-input');
    fireEvent.changeText(nameInput, 'My Test Capsule');

    // Add and write a message
    const addMessageButton = getByTestId('add-message-button');
    fireEvent.press(addMessageButton);
    const messageInput = getByTestId('message-input-1');
    fireEvent.changeText(messageInput, 'Hello future me!');

    // Check create button is enabled
    const createButton = getByTestId('create-capsule-button');
    expect(createButton).toBeTruthy();
    fireEvent.press(createButton);

    // Verify createCapsule was called
    expect(global.mockCreateCapsule).toHaveBeenCalled();
  });

  test('it allows custom icon input', () => {
    const { getByTestId } = renderedScreen;

    expect(getByTestId('custom-icon-input')).toBeTruthy();
    const customIconInput = getByTestId('custom-icon-input');

    fireEvent.changeText(customIconInput, '🚀');

    expect(customIconInput.props.value).toBe('🚀');
  });
});
