import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { Amplify, Auth } from 'aws-amplify';
import { amplifyConfig } from 'config';

if (typeof window !== 'undefined') Amplify.configure(amplifyConfig);

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state) => ({ ...state }),
  VERIFY_CODE: (state) => ({ ...state }),
  RESEND_CODE: (state) => ({ ...state }),
  PASSWORD_RECOVERY: (state) => ({ ...state }),
  PASSWORD_RESET: (state) => ({ ...state }),
  CURRENT_SESSION: (state, action) => {
    const { currentSession } = action.payload;

    return {
      ...state,
      currentSession
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext({
  ...initialAuthState,
  method: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve(),
  currentSession: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Documentation: https://github.com/aws-amplify/amplify-js/blob/4644b4322ee260165dd756ca9faeb235445000e3/packages/amazon-cognito-identity-js/index.d.ts#L48
        const user = await Auth.currentAuthenticatedUser();

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.sub,
              jobtitle: 'Conta Ouro',
              avatar: user.picture,
              email: user.email,
              name: user.name,
              role: user.role,
              location: user.location,
              username: user.username,
              posts: user.posts,
              coverImg: user.coverImg,
              followers: user.followers,
              description: user.description
            },
            currentSession: null
          }
        });
      } catch (error) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            currentSession: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const user = await Auth.signIn(email, password);

    dispatch({
      type: 'LOGIN',
      payload: { user }
    });
  };

  const logout = async () => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT'
    });
  };

  const register = async (email, password, phoneNumber) => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email, phone_number: phoneNumber }
    });

    dispatch({
      type: 'REGISTER'
    });
  };

  const verifyCode = async (username, code) => {
    await Auth.confirmSignUp(username, code);

    dispatch({
      type: 'VERIFY_CODE'
    });
  };

  const resendCode = async (username) => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE'
    });
  };

  const passwordRecovery = async (username) => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY'
    });
  };

  const passwordReset = async (username, code, newPassword) => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: 'PASSWORD_RESET'
    });
  };

  const currentSession = async () => {
    const currentSession = await Auth.currentSession();
    dispatch({
      type: 'CURRENT_SESSION',
      payload: { currentSession }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Amplify',
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset,
        currentSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
