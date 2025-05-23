import React, { createContext, useContext, useState } from "react";

interface SidebarContextProps {
    isSubMenuOpen: boolean;
    setIsSubMenuOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    return (
        <SidebarContext.Provider value={{ isSubMenuOpen, setIsSubMenuOpen }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
    return ctx;
};