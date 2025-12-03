import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from '../../app/(auth)/AuthProvider';

function HookConsumer() {
  const { isAuthenticated, startLogin } = useAuth();

  return (
    <>
      <Text testID="auth-state">{`isAuthenticated:${isAuthenticated}`}</Text>
      <Text testID="start-login-type">{`startLogin:${typeof startLogin}`}</Text>
    </>
  );
}

describe('useAuth hook', () => {
  it('returns context values when used within AuthProvider', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <HookConsumer />
      </AuthProvider>,
    );

    expect(getByTestId('auth-state').props.children).toBe('isAuthenticated:false');
    expect(getByTestId('start-login-type').props.children).toBe('startLogin:function');
  });

  it('throws a helpful error when rendered outside of AuthProvider', () => {
    expect(() => render(<HookConsumer />)).toThrow('useAuth must be used within an AuthProvider');
  });
});
