import axios from '~/lib/axios';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import useSWR from "swr";

interface User {
    id: string;
    email: string;
    name: string;
    is_onboarded: boolean;
    households: any[]
}

interface AuthenticationContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    isInOnboardingFlow: boolean;
    completeOnboardingFlow: () => void;
    shouldShowOnboarding: boolean;
}

const AuthenticationContext = createContext<AuthenticationContextType | undefined>(undefined);

interface AuthenticationProviderProps {
    children: ReactNode;
}

export const AuthenticationProvider: React.FC<AuthenticationProviderProps> = ({ children }) => {
    const [sessionOnboardingComplete, setSessionOnboardingComplete] = useState(false);
    const [hasStartedFlow, setHasStartedFlow] = useState(false);
    
    const {
        data: user,
        isLoading,
        error,
        mutate,
    } = useSWR("/user", (url) =>
        axios
            .get(url)
            .then((res) => res.data.data)
            .catch((error) => {
                if (error.response.status !== 409) throw error;
            }),
    );

    const setBearerToken = useCallback(async (token: string | null) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            await SecureStore.setItemAsync('token', token);

            mutate();
        } else {
            await SecureStore.deleteItemAsync('token');

            delete axios.defaults.headers.common['Authorization'];

            mutate(undefined, false);
        }
    }, [mutate]);

    const login = (token: string) => {
        setBearerToken(token);
    };

    const logout = () => {
        setBearerToken(null);
    };

    const isAuthenticated = !isLoading && !error && user !== undefined;
    
    // Determine if we should show onboarding
    const shouldShowOnboarding = !!(user && !user.is_onboarded && !sessionOnboardingComplete);
    
    // Auto-start onboarding flow when needed
    useEffect(() => {
        if (shouldShowOnboarding && !hasStartedFlow) {
            setHasStartedFlow(true);
        }
    }, [shouldShowOnboarding, hasStartedFlow]);
    
    // Check if we're currently in the onboarding flow
    const isInOnboardingFlow = hasStartedFlow && !sessionOnboardingComplete;
    
    const completeOnboardingFlow = () => {
        setSessionOnboardingComplete(true);
        setHasStartedFlow(false);
    };

    // Let's attempt to retrieve the token when the provider mounts.
    useEffect(() => {
        SecureStore.getItemAsync("token").then((token) => {
            if (token) {
                setBearerToken(token);
            }
        });
    }, [setBearerToken]);

    const value: AuthenticationContextType = {
        user,
        isAuthenticated,
        login,
        logout,
        isInOnboardingFlow,
        completeOnboardingFlow,
        shouldShowOnboarding,
    };

    return (
        <AuthenticationContext.Provider value={value}>
            {children}
        </AuthenticationContext.Provider>
    );
}

export function useAuthenticationContext(): AuthenticationContextType {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error('useAuthenticationContext must be used within an AuthenticationProvider');
    }
    return context;
}