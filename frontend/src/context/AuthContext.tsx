import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { User, authApi } from "@/api/authApi";
import { queryClient } from "@/main";
import { AUTH_TOKEN } from "@/constants";

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    signup: (username: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper functions for localStorage
const getStoredToken = () => localStorage.getItem("auth_token");
const getStoredUser = () => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
        try {
            return JSON.parse(userJson);
        } catch (e) {
            console.error("Error parsing stored user:", e);
            return null;
        }
    }
    return null;
};

const clearAuth = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getStoredUser());
    const [isLoading, setIsLoading] = useState(true);

    // Check token validity on startup
    useEffect(() => {
        const validateToken = async () => {
            setIsLoading(true);
            try {
                const token = getStoredToken();
                if (token) {
                    const profile = await authApi.getProfile();
                    setUser(profile);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Profile validation failed:", error);
                clearAuth();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        validateToken();
    }, []);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await authApi.login({ username, password });
            localStorage.setItem(AUTH_TOKEN, data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const signup = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const data = await authApi.signup({ username, password });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            return data;
        } catch (error) {
            console.error("Signup failed:", error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        clearAuth();
        setUser(null);
        queryClient.setQueryData(['user'], null);
        // Navigation will be handled by the component using the auth context
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};