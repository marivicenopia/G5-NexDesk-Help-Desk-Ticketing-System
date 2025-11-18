// src/features/TicketSummary/TicketSummary.tsx
import React, { useState, useEffect } from 'react';
import type { TicketSummaryItem, TicketSummaryStatus, TicketSummaryPriority } from '../../../types/ticket';
import TicketList from './TicketList';
import styles from './TicketSummary.module.css';

const API_URL = '/api/tickets';

const TicketSummary: React.FC = () => {
    const [tickets, setTickets] = useState<TicketSummaryItem[]>([]);
    const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Convert regular tickets to ticket summary format
    const convertToTicketSummaryFormat = (originalTickets: any[]): TicketSummaryItem[] => {
        return originalTickets.map((ticket) => ({
            id: ticket.id.toString(),
            titleMain: ticket.title || `Ticket #${ticket.id}`,
            titleSub: ticket.description?.substring(0, 50) + '...' || 'No description',
            number: `#${ticket.id}`,
            status: ticket.status === 'open' || ticket.status === 'assigned' || ticket.status === 'in progress'
                ? 'IN_PROGRESS' as TicketSummaryStatus
                : 'CLOSED' as TicketSummaryStatus,
            identifier: ticket.customerEmail || ticket.submittedBy || `ID-${ticket.id}`,
            priority: ticket.priority?.toUpperCase() as TicketSummaryPriority || 'MEDIUM',
        }));
    };

    // Fetch tickets when component mounts
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(API_URL, { credentials: 'include' });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const raw: any = await response.json();
                const data: any[] = Array.isArray(raw) ? raw : (raw.response ?? []);
                const convertedTickets = convertToTicketSummaryFormat(data);
                setTickets(convertedTickets);
            } catch (e) {
                if (e instanceof Error) {
                    setError(e.message);
                    console.error("Failed to fetch tickets:", e);
                } else {
                    setError("An unknown error occurred");
                    console.error("Failed to fetch tickets:", e);
                }
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    const handleEditClick = (ticketId: string) => {
        setEditingTicketId(ticketId);
    };

    const handleCancelClick = () => {
        setEditingTicketId(null);
    };

    const handleSaveClick = async (ticketId: string, newStatus: TicketSummaryStatus, newPriority: TicketSummaryPriority) => {
        const ticketToUpdate = tickets.find(t => t.id === ticketId);
        if (!ticketToUpdate) return;

        // Convert back to original format for API
        const statusMapping: Record<TicketSummaryStatus, string> = {
            'IN_PROGRESS': 'in progress',
            'CLOSED': 'closed'
        };

        const priorityMapping: Record<TicketSummaryPriority, string> = {
            'LOW': 'low',
            'MEDIUM': 'medium',
            'HIGH': 'high'
        };

        try {
            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: statusMapping[newStatus],
                    priority: priorityMapping[newPriority]
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update local state
            const updatedTicket = { ...ticketToUpdate, status: newStatus, priority: newPriority };
            setTickets(prevTickets =>
                prevTickets.map(ticket => (ticket.id === ticketId ? updatedTicket : ticket))
            );
            setEditingTicketId(null);
            console.log(`Ticket ${ticketId} saved with Status: ${newStatus}, Priority: ${newPriority}`);
        } catch (e) {
            if (e instanceof Error) {
                setError(`Failed to save ticket ${ticketId}: ${e.message}`);
                console.error("Failed to save ticket:", e);
            } else {
                setError(`Failed to save ticket ${ticketId}: An unknown error occurred`);
                console.error("Failed to save ticket:", e);
            }
        }
    };

    if (loading) {
        return <div className={styles.loadingMessage}>Loading tickets...</div>;
    }

    if (error) {
        return <div className={styles.errorMessage}>Error: {error}</div>;
    }

    return (
        <div className={styles.ticketSummaryContainer}>
            <div className={styles.headerActions}>
                <h1 className={styles.pageTitle}>Ticket Tracking</h1>
                <div className={styles.actionIcons}>
                    <button className={styles.iconButton} aria-label="Menu">☰</button>
                    <button className={styles.iconButton} aria-label="View Options">≣</button>
                </div>
            </div>
            <TicketList
                tickets={tickets}
                editingTicketId={editingTicketId}
                onEditClick={handleEditClick}
                onSaveClick={handleSaveClick}
                onCancelClick={handleCancelClick}
            />
        </div>
    );
};

export default TicketSummary;
