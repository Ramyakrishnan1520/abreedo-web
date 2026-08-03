export const LOGIN_CONTENT = {
  branding: {
    title: 'AMCA Portal',
    subtitle: 'Client Administration & Member Management System',
  },
  fields: {
    usernameLabel: 'Username',
    usernamePlaceholder: 'Enter username',
    passwordLabel: 'Password',
    passwordPlaceholder: '************',
  },
  validation: {
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
  },
  actions: {
    signIn: 'Sign In',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
  },
  errors: {
    invalidCredentials:
      'Invalid username or password. Please check your credentials.',
  },
} as const
