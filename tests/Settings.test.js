import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Settings from '../components/Settings';

describe('<Settings />', () => {
  let renderedScreen;

  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = render(<Settings navigation={{ navigate: global.mockNavigate }} />);
  });

  test('it should match snapshot', () => {
    const snapshot = renderedScreen.toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  test('it renders Settings screen with profile information', () => {
    const { getByText, getByTestId } = renderedScreen;

    // Check if profile information is displayed
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john.doe@example.com')).toBeTruthy();
    expect(getByText('August 21, 2025')).toBeTruthy();

    // Check if change password section is rendered
    expect(getByText('Change Password')).toBeTruthy();
    expect(getByTestId('current-password-input')).toBeTruthy();
    expect(getByTestId('new-password-input')).toBeTruthy();
    expect(getByTestId('confirm-new-password-input')).toBeTruthy();

    // Check if buttons are rendered
    expect(getByTestId('update-password-button')).toBeTruthy();
    expect(getByTestId('logout-button')).toBeTruthy();
  });

  test('it handles password input changes', () => {
    const { getByTestId } = renderedScreen;

    const currentPasswordInput = getByTestId('current-password-input');
    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-new-password-input');

    fireEvent.changeText(currentPasswordInput, 'password');
    fireEvent.changeText(newPasswordInput, 'newpassword');
    fireEvent.changeText(confirmPasswordInput, 'newpassword');

    expect(currentPasswordInput.props.value).toBe('password');
    expect(newPasswordInput.props.value).toBe('newpassword');
    expect(confirmPasswordInput.props.value).toBe('newpassword');
  });

  test('it shows password error when passwords do not match', () => {
    const { getByTestId, getByText } = renderedScreen;

    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-new-password-input');

    fireEvent.changeText(newPasswordInput, 'a');
    fireEvent.changeText(confirmPasswordInput, 'b');

    expect(getByText('Passwords do not match')).toBeTruthy();
  });

  test('it calls logout when logout button is pressed', () => {
    const { getByTestId } = renderedScreen;
    const logoutButton = getByTestId('logout-button');

    fireEvent.press(logoutButton);

    expect(global.mockLogout).toHaveBeenCalled();
  });

  test('it calls changePassword when form is submitted', async () => {
    const { getByTestId } = renderedScreen;

    const currentPasswordInput = getByTestId('current-password-input');
    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-new-password-input');
    const updateButton = getByTestId('update-password-button');

    // Fill the form
    fireEvent.changeText(currentPasswordInput, 'password');
    fireEvent.changeText(newPasswordInput, 'newpassword');
    fireEvent.changeText(confirmPasswordInput, 'newpassword');

    fireEvent.press(updateButton);

    expect(global.mockChangePassword).toHaveBeenCalledWith({
      currentPassword: 'password',
      newPassword: 'newpassword'
    });
  });

  test('it does not call changePassword when missing fields', async () => {
    const { getByTestId } = renderedScreen;

    const updateButton = getByTestId('update-password-button');

    fireEvent.press(updateButton);

    expect(global.mockChangePassword).not.toHaveBeenCalled();
  });

  test('it does not call changePassword when passwords do not match', async () => {
    const { getByTestId } = renderedScreen;

    const currentPasswordInput = getByTestId('current-password-input');
    const newPasswordInput = getByTestId('new-password-input');
    const confirmPasswordInput = getByTestId('confirm-new-password-input');
    const updateButton = getByTestId('update-password-button');

    // Fill form with different passwords
    fireEvent.changeText(currentPasswordInput, 'password');
    fireEvent.changeText(newPasswordInput, 'newpassword');
    fireEvent.changeText(confirmPasswordInput, 'differentpassword');

    fireEvent.press(updateButton);

    expect(global.mockChangePassword).not.toHaveBeenCalled();
  });
});
