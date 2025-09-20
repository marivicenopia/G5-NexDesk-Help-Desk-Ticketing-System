export interface TicketPreferences {
    defaultStatus: string;
    defaultPriority: string;
    defaultSortBy: string;
    defaultSortOrder: 'asc' | 'desc';
    itemsPerPage: number;
}

export const DEFAULT_PREFERENCES: TicketPreferences = {
    defaultStatus: 'open',
    defaultPriority: 'high',
    defaultSortBy: 'priority',
    defaultSortOrder: 'desc',
    itemsPerPage: 10
};

export const PreferencesService = {
    getPreferences: (userId: string): TicketPreferences => {
        try {
            const storedPrefs = localStorage.getItem(`ticketPreferences_${userId}`);
            if (storedPrefs) {
                return { ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) };
            }
            return DEFAULT_PREFERENCES;
        } catch (error) {
            console.error('Error loading preferences:', error);
            return DEFAULT_PREFERENCES;
        }
    },

    savePreferences: (userId: string, preferences: TicketPreferences): void => {
        try {
            localStorage.setItem(`ticketPreferences_${userId}`, JSON.stringify(preferences));
        } catch (error) {
            console.error('Error saving preferences:', error);
        }
    },

    resetPreferences: (userId: string): void => {
        try {
            localStorage.removeItem(`ticketPreferences_${userId}`);
        } catch (error) {
            console.error('Error resetting preferences:', error);
        }
    }
};
