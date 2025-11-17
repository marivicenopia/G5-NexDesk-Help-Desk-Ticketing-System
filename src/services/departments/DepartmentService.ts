export interface Department {
    id: string;
    name: string;
    description?: string;
    isActive?: boolean;
    createdTime?: string;
    updatedTime?: string;
}

export interface CreateDepartmentRequest {
    name: string;
    description?: string;
}

export interface UpdateDepartmentRequest {
    name: string;
    description?: string;
    isActive?: boolean;
}

export class DepartmentService {
    private static baseUrl = 'http://localhost:5000/api/Department';

    /**
     * Get all departments
     */
    static async getAll(): Promise<Department[]> {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.response || [];
        } catch (error) {
            console.error('Error fetching all departments:', error);
            throw error;
        }
    }

    /**
     * Get active departments only
     */
    static async getActive(): Promise<Department[]> {
        try {
            const response = await fetch(`${this.baseUrl}/active`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.response || [];
        } catch (error) {
            console.error('Error fetching active departments:', error);
            throw error;
        }
    }

    /**
     * Get department by ID
     */
    static async getById(id: string): Promise<Department | null> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.response || null;
        } catch (error) {
            console.error('Error fetching department by ID:', error);
            throw error;
        }
    }

    /**
     * Create new department
     */
    static async create(departmentData: CreateDepartmentRequest): Promise<Department> {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(departmentData),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.response;
        } catch (error) {
            console.error('Error creating department:', error);
            throw error;
        }
    }

    /**
     * Update department
     */
    static async update(id: string, departmentData: UpdateDepartmentRequest): Promise<Department> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(departmentData),
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.response;
        } catch (error) {
            console.error('Error updating department:', error);
            throw error;
        }
    }

    /**
     * Delete department (soft delete)
     */
    static async delete(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    return false;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting department:', error);
            throw error;
        }
    }

    /**
     * Get department names only (for dropdowns)
     */
    static async getDepartmentNames(): Promise<{ id: string; name: string }[]> {
        try {
            const departments = await this.getActive();
            return departments.map(dept => ({
                id: dept.id,
                name: dept.name
            }));
        } catch (error) {
            console.error('Error fetching department names:', error);
            // Return fallback departments if API fails
            return [
                { id: '1', name: 'IT' },
                { id: '2', name: 'HR' },
                { id: '3', name: 'Finance' },
                { id: '4', name: 'Marketing' },
                { id: '5', name: 'Operations' }
            ];
        }
    }
}