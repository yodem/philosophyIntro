import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
    mode: 'light' | 'dark';
    direction: 'rtl';
    toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const direction = 'rtl';

    document.documentElement.setAttribute('dir', direction);

    const toggleMode = () => {
        setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    useEffect(() => {
        document.dir = direction;
    }, [direction]);

    return (
        <ThemeContext.Provider value={{ mode, direction, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
