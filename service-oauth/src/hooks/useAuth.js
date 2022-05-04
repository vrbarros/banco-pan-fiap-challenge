import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AmplifyContext';

export const useAuth = () => useContext(AuthContext);
