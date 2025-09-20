// src/features/TicketSummary/TicketSummary.tsx
import React, { useState, useEffect } from 'react';
// Ensure your type import path is correct (e.g., '../../types' or '../assets/types/index')
import type { Ticket, TicketPriority, TicketStatus } from '../assets/types';
import TicketList from './TicketList';
import styles from './TicketSummary.module.css';

const API_URL = 'http://localhost:3001/tickets'; // URL for your json-server

const TicketSummary: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // For loading state
  const [error, setError] = useState<string | null>(null);   // For error state

  // Fetch tickets when component mounts
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Ticket[] = await response.json();
        setTickets(data);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
          console.error("Failed to fetch tickets:", e);
        } else {
          setError("An unknown error occurred");
          console.error("Failed to fetch tickets:", e);
        }
        setTickets([]); // Set to empty array on error or provide some fallback
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []); // Empty dependency array means this runs once on mount

  const handleEditClick = (ticketId: string) => {
    setEditingTicketId(ticketId);
  };

  const handleCancelClick = () => {
    setEditingTicketId(null);
  };

  const handleSaveClick = async (ticketId: string, newStatus: TicketStatus, newPriority: TicketPriority) => {
    const ticketToUpdate = tickets.find(t => t.id === ticketId);
    if (!ticketToUpdate) return;

    const updatedTicket = { ...ticketToUpdate, status: newStatus, priority: newPriority };

    try {
      const response = await fetch(`${API_URL}/${ticketId}`, {
        method: 'PUT', // Or 'PATCH' if you only send changed fields
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const savedTicket: Ticket = await response.json();
      setTickets(prevTickets =>
        prevTickets.map(ticket => (ticket.id === ticketId ? savedTicket : ticket))
      );
      setEditingTicketId(null); // Exit edit mode
      console.log(`Ticket ${ticketId} saved with Status: ${newStatus}, Priority: ${newPriority}`);
    } catch (e) {
      if (e instanceof Error) {
        setError(`Failed to save ticket ${ticketId}: ${e.message}`);
        console.error("Failed to save ticket:", e);
      } else {
        setError(`Failed to save ticket ${ticketId}: An unknown error occurred`);
        console.error("Failed to save ticket:", e);
      }
      // Optionally, you might not want to exit edit mode if save fails,
      // or you might revert the local state to what it was before attempting to save.
    }
  };

  if (loading) {
    return <div className={styles.loadingMessage}>Loading tickets...</div>; // Add a .loadingMessage style
  }

  if (error) {
    return <div className={styles.errorMessage}>Error: {error}</div>; // Add an .errorMessage style
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