
import React, { useState, useEffect, useRef, type JSX } from 'react';
import { ticketService } from './services/ticketService';
import type { Ticket, Employee, Team } from './services/ticketService';

interface AssignmentOption {
  id: string;
  name: string;
  type: 'employee' | 'team';
}

function ReassignTicket(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Track which dropdown is currently open and reassignment selections
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [reassignments, setReassignments] = useState<{ [ticketId: string]: AssignmentOption }>({});
  
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [ticketsData, employeesData, teamsData] = await Promise.all([
          ticketService.getAllTickets(),
          ticketService.getAllEmployees(),
          ticketService.getAllTeams()
        ]);
        
        setTickets(ticketsData);
        setEmployees(employeesData);
        setTeams(teamsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (openDropdown && 
          dropdownRefs.current[openDropdown] && 
          !dropdownRefs.current[openDropdown]?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (ticketId: string) => {
    setOpenDropdown(openDropdown === ticketId ? null : ticketId);
  };

  const selectAssignment = (ticketId: string, option: AssignmentOption) => {
    setReassignments(prev => ({
      ...prev,
      [ticketId]: option
    }));
    setOpenDropdown(null);
  };

  const handleReassign = async (ticketId: string) => {
    const assignment = reassignments[ticketId];
    if (!assignment) {
      alert('Please select an agent or team to reassign to');
      return;
    }

    try {
      setSaving(true);
      await ticketService.assignTicket(ticketId, assignment.name);
      
      // Refresh tickets
      const updatedTickets = await ticketService.getAllTickets();
      setTickets(updatedTickets);
      
      // Remove from reassignments
      setReassignments(prev => {
        const { [ticketId]: _, ...rest } = prev;
        return rest;
      });

      alert(`Ticket reassigned to ${assignment.name} successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reassign ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkUpdate = async () => {
    const ticketsToUpdate = Object.entries(reassignments);
    
    if (ticketsToUpdate.length === 0) {
      alert('No reassignments selected');
      return;
    }

    try {
      setSaving(true);
      
      // Process all reassignments
      await Promise.all(
        ticketsToUpdate.map(([ticketId, assignment]) =>
          ticketService.assignTicket(ticketId, assignment.name)
        )
      );

      // Refresh tickets
      const updatedTickets = await ticketService.getAllTickets();
      setTickets(updatedTickets);
      
      // Clear reassignments
      setReassignments({});
      
      alert(`${ticketsToUpdate.length} tickets reassigned successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to reassign tickets');
    } finally {
      setSaving(false);
    }
  };

  // Combine employees and teams for dropdown options
  const assignmentOptions: AssignmentOption[] = [
    ...employees.map(emp => ({ id: emp.id, name: emp.name, type: 'employee' as const })),
    ...teams.map(team => ({ id: team.id, name: team.name, type: 'team' as const }))
  ];

  // Custom dropdown component
  const AssignmentDropdown = ({ ticket }: { ticket: Ticket }) => {
    const isOpen = openDropdown === ticket.id;
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const selectedAssignment = reassignments[ticket.id];
    
    const setRef = (el: HTMLDivElement | null) => {
      if (el) {
        dropdownRefs.current[ticket.id] = el;
      }
    };

    // Calculate dropdown position when it opens
    useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX
        });
      }
    }, [isOpen]);

    return (
      <div className="relative inline-block w-48" ref={setRef}>
        <button
          className="flex justify-between items-center w-full px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={(e) => {
            e.stopPropagation();
            toggleDropdown(ticket.id);
          }}
          type="button"
          ref={buttonRef}
        >
          <span className="truncate">
            {selectedAssignment ? (
              <>
                {selectedAssignment.type === 'employee' ? '👤' : '👥'} {selectedAssignment.name}
              </>
            ) : (
              'Select Agent/Team'
            )}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            {isOpen ? '▲' : '▼'}
          </span>
        </button>

        {isOpen && (
          <div 
            className="fixed z-50 w-56 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            {assignmentOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              assignmentOptions.map((option) => (
                <button
                  key={`${option.type}-${option.id}`}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAssignment(ticket.id, option);
                  }}
                  type="button"
                >
                  <span className="mr-2">
                    {option.type === 'employee' ? '👤' : '👥'}
                  </span>
                  <span className="truncate">{option.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {option.type}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-5 bg-white w-full h-screen overflow-y-auto text-center">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-5 bg-white w-full h-screen overflow-y-auto text-red-500 text-center">Error: {error}</div>;
  }

  // Filter assigned tickets only
  const assignedTickets = tickets.filter(ticket => ticket.assignedTo);

  return (
    <div className="p-5 bg-white w-full h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Reassign Tickets</h1>
      
      {/* Summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Total Assigned Tickets: <span className="font-semibold">{assignedTickets.length}</span>
            </p>
            <p className="text-sm text-gray-600">
              Pending Reassignments: <span className="font-semibold">{Object.keys(reassignments).length}</span>
            </p>
          </div>
          {Object.keys(reassignments).length > 0 && (
            <button
              onClick={handleBulkUpdate}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Updating...' : `Update ${Object.keys(reassignments).length} Assignments`}
            </button>
          )}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-3 border-b grid grid-cols-6 text-sm font-medium text-gray-700">
          <div className="flex items-center">
            <span className="mr-1.5 text-yellow-500">📋</span> TICKET ID
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-blue-500">📝</span> DESCRIPTION
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-purple-500">👤</span> CURRENTLY ASSIGNED
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-green-500">🔄</span> REASSIGN TO
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-orange-500">⚡</span> STATUS
          </div>
          <div className="flex items-center">
            <span className="mr-1.5 text-blue-500">🔧</span> ACTION
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {assignedTickets.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No assigned tickets found</div>
          ) : (
            assignedTickets.map((ticket) => (
              <div key={ticket.id} className="grid grid-cols-6 p-3 border-b hover:bg-gray-50">
                <div className="text-[#333] font-medium">{ticket.id}</div>
                <div className="text-[#333] truncate pr-2" title={ticket.description}>
                  {ticket.description}
                </div>
                <div className="text-[#333]">
                  <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    👤 {ticket.assignedTo}
                  </span>
                </div>
                <div>
                  <AssignmentDropdown ticket={ticket} />
                </div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ticket.status === 'open' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : ticket.status === 'in-progress'
                        ? 'bg-blue-100 text-blue-800'
                        : ticket.status === 'resolved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  {reassignments[ticket.id] && (
                    <button
                      onClick={() => handleReassign(ticket.id)}
                      disabled={saving}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Updating...' : 'Reassign'}
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Select new assignments from the dropdown menus</li>
          <li>• Use individual "Reassign" buttons for single tickets</li>
          <li>• Use "Update Assignments" button for bulk reassignment</li>
          <li>• 👤 indicates employees, 👥 indicates teams</li>
        </ul>
      </div>
    </div>
  );
}

export default ReassignTicket;