import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SignUp from '../components/SignUp';

describe('<SignUp />', () => {
  let renderedScreen;

  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = render(<SignUp />);
  });

  test('it should match snapshot', () => {
    const snapshot = renderedScreen.toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  test('it renders SignUp screen correctly', () => {
    const { getByText, getByTestId } = renderedScreen;

    // Check if main elements are rendered
    expect(getByText('Sign up for Timetravel')).toBeTruthy();
    expect(getByText('Create an account to start your journey')).toBeTruthy();

    // Check if form inputs are rendered
    expect(getByTestId('name-input')).toBeTruthy();
    expect(getByTestId('last-name-input')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('confirm-password-input')).toBeTruthy();

    // Check if buttons are rendered
    expect(getByTestId('register-button')).toBeTruthy();
    expect(getByTestId('cancel-button')).toBeTruthy();
  });

  test('it goes back when Cancel button is pressed', () => {
    const { getByTestId } = renderedScreen;
    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    // Check if goBack function is called
    expect(global.mockGoBack).toHaveBeenCalled();
  });

  test('it shows error message when passwords do not match', () => {
    const { getByTestId, getByText } = renderedScreen;
    const passwordInput = getByTestId('password-input');
    const confirmPasswordInput = getByTestId('confirm-password-input');
    fireEvent.changeText(passwordInput, 'a');
    fireEvent.changeText(confirmPasswordInput, 'b');

    // Check if error message is shown
    const passwordError = getByText('Passwords do not match');
    expect(passwordError).toBeTruthy();
  });
});
