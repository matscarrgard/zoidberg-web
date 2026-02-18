import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-west-2_zY0Mfeg3Z',
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'q6qis2h7je8v8prffobqtc6qt',
      loginWith: {
        email: true,
      },
    },
  },
};

Amplify.configure(amplifyConfig, { ssr: true });

export default amplifyConfig;
