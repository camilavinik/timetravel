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
    const { getByText, getByTestId } = renderedScreen;

    // Check if main elements are rendered
    expect(getByText('Welcome to Timetravel')).toBeTruthy();
    expect(getByText('Sign in to continue your journey')).toBeTruthy();

    // Check if form inputs are rendered
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();

    // Check if buttons are rendered
    expect(getByTestId('sign-in-button')).toBeTruthy();
    expect(getByTestId('sign-up-button')).toBeTruthy();
  });

  test('it navigates to SignUp when Sign up button is pressed', () => {
    const { getByTestId } = renderedScreen;
    const signUpButton = getByTestId('sign-up-button');
    fireEvent.press(signUpButton);

    // Check if navigate function is called
    expect(global.mockNavigate).toHaveBeenCalledWith('SignUp');
  });
});
