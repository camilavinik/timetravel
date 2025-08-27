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
    const { getByText, getByPlaceholderText } = renderedScreen;
    
    // Check if main elements are rendered
    expect(getByText('Sign up for Timetravel')).toBeTruthy();
    expect(getByText('Create an account to start your journey')).toBeTruthy();
    
    // Check if form inputs are rendered
    expect(getByPlaceholderText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Last Name')).toBeTruthy();
    expect(getByPlaceholderText('email@address.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm Password')).toBeTruthy();
    
    // Check if buttons are rendered
    const registerButton = getByText('Register');
    const cancelButton = getByText('Cancel');
    expect(registerButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });

  test('it goes back when Cancel button is pressed', () => {
    const { getByText } = renderedScreen;
    const cancelButton = getByText('Cancel');
    fireEvent.press(cancelButton);

    // Check if goBack function is called
    expect(global.mockGoBack).toHaveBeenCalled();
  });

  test('it shows error message when passwords do not match', () => {
    const { getByPlaceholderText, getByText } = renderedScreen;
    const passwordInput = getByPlaceholderText('Password');
    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    fireEvent.changeText(passwordInput, 'a');
    fireEvent.changeText(confirmPasswordInput, 'b');

    // Check if error message is shown
    const passwordError = getByText('Passwords do not match');
    expect(passwordError).toBeTruthy();
  });
});
