import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LogIn from '../components/LogIn';

describe('<LogIn />', () => {
  let renderedScreen;

  beforeEach(() => {
    jest.clearAllMocks();
    renderedScreen = render(<LogIn />);
  });

  test('it should match snapshot', () => {
    const snapshot = renderedScreen.toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  test('it renders LogIn screen correctly', () => {
    const { getByText, getByPlaceholderText } = renderedScreen;

    // Check if main elements are rendered
    expect(getByText('Welcome to Timetravel')).toBeTruthy();
    expect(getByText('Sign in to continue your journey')).toBeTruthy();

    // Check if form inputs are rendered
    expect(getByPlaceholderText('email@address.com')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();

    // Check if buttons are rendered
    const signInButton = getByText('Sign in');
    const signUpButton = getByText('Sign up');
    expect(signInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
  });

  test('it navigates to SignUp when Sign up button is pressed', () => {
    const { getByText } = renderedScreen;
    const signUpButton = getByText('Sign up');
    fireEvent.press(signUpButton);

    // Check if navigate function is called
    expect(global.mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});
