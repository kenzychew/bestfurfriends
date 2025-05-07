import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  registerStart, 
  registerSuccess, 
  registerFailure,
  selectUser, 
  selectToken, 
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  clearError
} from '../store/slices/authSlice';
import authService from '../services/authService';
import { LoginFormValues } from '../lib/validators';
import { RegisterFormValues } from '../lib/validators';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleLogin = useCallback(async (credentials: LoginFormValues) => {
    try {
      dispatch(loginStart());
      const response = await authService.login(credentials);
      dispatch(loginSuccess(response));
      navigate('/');
      return true;
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(loginFailure(errorMessage));
      return false;
    }
  }, [dispatch, navigate]);

  const handleRegister = useCallback(async (userData: RegisterFormValues) => {
    try {
      dispatch(registerStart());
      // Remove confirmPassword before sending to API
      const { confirmPassword: _, ...registrationData } = userData;
      const response = await authService.register(registrationData);
      dispatch(registerSuccess(response));
      navigate('/');
      return true;
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      dispatch(registerFailure(errorMessage));
      return false;
    }
  }, [dispatch, navigate]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    clearError: handleClearError
  };
}; 
