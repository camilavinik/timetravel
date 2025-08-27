import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
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
    const { getByText, getByPlaceholderText } = renderedScreen;

    // Check if profile information is displayed
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john.doe@example.com')).toBeTruthy();
    expect(getByText('August 21, 2025')).toBeTruthy();

    // Check if change password section is rendered
    expect(getByText('Change Password')).toBeTruthy();
    expect(getByPlaceholderText('Enter current password')).toBeTruthy();
    expect(getByPlaceholderText('Enter new password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm new password')).toBeTruthy();

    // Check if buttons are rendered
    expect(getByText('Update password')).toBeTruthy();
    expect(getByText('Logout')).toBeTruthy();
  });

  test('it handles password input changes', () => {
    const { getByPlaceholderText } = renderedScreen;

    const currentPasswordInput = getByPlaceholderText('Enter current password');
    const newPasswordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');

    act(() => {
      fireEvent.changeText(currentPasswordInput, 'password');
      fireEvent.changeText(newPasswordInput, 'newpassword');
      fireEvent.changeText(confirmPasswordInput, 'newpassword');
    });

    expect(currentPasswordInput.props.value).toBe('password');
    expect(newPasswordInput.props.value).toBe('newpassword');
    expect(confirmPasswordInput.props.value).toBe('newpassword');
  });

  test('it shows password error when passwords do not match', () => {
    const { getByPlaceholderText, getByText } = renderedScreen;

    const newPasswordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');

    act(() => {
      fireEvent.changeText(newPasswordInput, 'a');
      fireEvent.changeText(confirmPasswordInput, 'b');
    });

    expect(getByText('Passwords do not match')).toBeTruthy();
  });

  test('it calls logout when logout button is pressed', () => {
    const { getByText } = renderedScreen;
    const logoutButton = getByText('Logout');

    act(() => {
      fireEvent.press(logoutButton);
    });

    expect(global.mockLogout).toHaveBeenCalled();
  });

  test('it calls changePassword when form is submitted', async () => {
    const { getByPlaceholderText, getByText } = renderedScreen;

    const currentPasswordInput = getByPlaceholderText('Enter current password');
    const newPasswordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');
    const updateButton = getByText('Update password');

    // Fill the form
    act(() => {
      fireEvent.changeText(currentPasswordInput, 'password');
      fireEvent.changeText(newPasswordInput, 'newpassword');
      fireEvent.changeText(confirmPasswordInput, 'newpassword');
    });

    await act(async () => {
      fireEvent.press(updateButton);
    });

    expect(global.mockChangePassword).toHaveBeenCalledWith({
      currentPassword: 'password',
      newPassword: 'newpassword'
    });
  });

  test('it does not call changePassword when missing fields', async () => {
    const { getByText } = renderedScreen;

    const updateButton = getByText('Update password');

    await act(async () => {
      fireEvent.press(updateButton);
    });

    expect(global.mockChangePassword).not.toHaveBeenCalled();
  });

  test('it does not call changePassword when passwords do not match', async () => {
    const { getByPlaceholderText, getByText } = renderedScreen;

    const currentPasswordInput = getByPlaceholderText('Enter current password');
    const newPasswordInput = getByPlaceholderText('Enter new password');
    const confirmPasswordInput = getByPlaceholderText('Confirm new password');
    const updateButton = getByText('Update password');

    // Fill form with different passwords
    act(() => {
      fireEvent.changeText(currentPasswordInput, 'password');
      fireEvent.changeText(newPasswordInput, 'newpassword');
      fireEvent.changeText(confirmPasswordInput, 'differentpassword');
    });

    await act(async () => {
      fireEvent.press(updateButton);
    });

    expect(global.mockChangePassword).not.toHaveBeenCalled();
  });
});
