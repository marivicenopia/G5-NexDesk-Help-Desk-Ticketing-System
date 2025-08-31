import React, { useState, useEffect, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketService } from './services/ticketService';
import type { Ticket, Employee, Team } from './services/ticketService';

function AssignTicket(): JSX.Element {
  const navigate = useNavigate();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  
  // Load data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        
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

  
  const handleTicketSelection = (ticketId: string) => {
    if (selectedTicket === ticketId) {
      setSelectedTicket(null);
    } else {
      setSelectedTicket(ticketId);
    }
  };


  const handleAgentSelection = async (employeeId: string) => {
    if (!selectedTicket) {
      alert('Please select a ticket first');
      return;
    }
    
    
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) return;
    
    try {
      
      await ticketService.assignTicket(selectedTicket, employee.name);
      
      
      const updatedTickets = await ticketService.getAllTickets();
      setTickets(updatedTickets);
      
     
      setSelectedAgentId(employeeId);
      setSelectedTeamId(null);

      alert(`Ticket assigned to ${employee.name} successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign ticket');
    }
  };

  
  const handleTeamSelection = async (teamId: string) => {
    if (!selectedTicket) {
      alert('Please select a ticket first');
      return;
    }
    
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    
    try {
     
      await ticketService.assignTicket(selectedTicket, team.name);
      
      
      const updatedTickets = await ticketService.getAllTickets();
      setTickets(updatedTickets);
      
     
      setSelectedTeamId(teamId);
      setSelectedAgentId(null);

      alert(`Ticket assigned to ${team.name} successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to assign ticket');
    }
  };

  
  const handleEdit = (ticketId: string) => {
    navigate('/edit-ticket', { state: { ticketId } });
  };

 
  const handleDelete = async (ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      try {
        await ticketService.deleteTicket(ticketId);
       
        const updatedTickets = await ticketService.getAllTickets();
        setTickets(updatedTickets);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to delete ticket');
      }
    }
  };

  if (loading) {
    return <div className="p-5 text-center">Loading tickets...</div>;
  }

  if (error) {
    return <div className="p-5 text-red-500">Error: {error}</div>;
  }

  
  const unassignedTickets = tickets.filter(ticket => !ticket.assignedTo);
  
 
  const getPriorityValue = (priority: string): number => {
    switch (priority.toLowerCase()) {
      case 'critical': return 0;
      case 'high': return 1;
      case 'medium': return 2;
      case 'low': return 3;
      default: return 4;
    }
  };
  
  const sortedTickets = [...unassignedTickets].sort((a, b) => {
    return getPriorityValue(a.priorityStatus) - getPriorityValue(b.priorityStatus);
  });

  return (
    <div className="p-5 bg-white w-full h-screen overflow-y-auto">
      <h1 className="text-2xl font-bold text-[#333] border-b pb-2 mb-6">Assign Ticket</h1>
      
      {/* Tickets Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-[#333] mb-4">Select Ticket</h2>
        
        <div className="border rounded mb-6">
          <div className="bg-gray-50 p-3 border-b grid grid-cols-7 text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <span className="mr-1.5 text-yellow-500">📋</span> Ticket ID
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-purple-500">👤</span> CUSTOMER
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">📧</span> EMAIL
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> STATUS
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-orange-500">⚡</span> PRIORITY
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> ACTION
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-gray-500">📝</span> NOTE
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {sortedTickets.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No unassigned tickets found</div>
            ) : (
              sortedTickets.map((ticket) => (
                <div key={ticket.id} className="grid grid-cols-7 p-3 border-b hover:bg-gray-50">
                  <div className="text-[#333]">{ticket.id}</div>
                  <div className="text-[#333]">{ticket.customerName}</div>
                  <div className="text-[#333] truncate">{ticket.customerEmail}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'open' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : ticket.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.priorityStatus.toLowerCase() === 'critical' ? 'bg-purple-100 text-purple-800' :
                      ticket.priorityStatus.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                      ticket.priorityStatus.toLowerCase() === 'medium' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.priorityStatus.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <button 
                      onClick={() => handleTicketSelection(ticket.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        selectedTicket === ticket.id
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-green-200 text-green-800'
                      }`}
                    >
                      {selectedTicket === ticket.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                  <div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEdit(ticket.id)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      >
                        <span className="text-orange-400">✏️</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      >
                        <span className="text-gray-400">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Agent Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-[#333] mb-4">Select Agent</h2>
        
        <div className="border rounded">
          <div className="bg-gray-50 p-3 border-b grid grid-cols-6 text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <span className="mr-1.5 text-yellow-500">📋</span> Ticket ID
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-purple-500">👤</span> NAME
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> STATUS
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">📅</span> DATE
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-orange-500">⚡</span> PRIORITY
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> ACTION
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {employees.map((employee) => (
              <div key={employee.id} className="grid grid-cols-6 p-3 border-b hover:bg-gray-50">
                <div className="text-[#333]">{selectedTicket || '-'}</div>
                <div className="text-[#333]">{employee.name}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    employee.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[#333]">May 19, 2025</div>
                <div className="text-[#333]">MEDIUM</div>
                <div>
                  <button 
                    onClick={() => handleAgentSelection(employee.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedAgentId === employee.id
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-green-200 text-green-800'
                    }`}
                    disabled={!selectedTicket || employee.status !== 'available'}
                  >
                    {selectedAgentId === employee.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-6">
        <h2 className="text-xl font-medium text-[#333] mb-4">Select Team</h2>
        
        <div className="border rounded">
          <div className="bg-gray-50 p-3 border-b grid grid-cols-6 text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <span className="mr-1.5 text-yellow-500">📋</span> Ticket ID
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-purple-500">👥</span> NAME
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> STATUS
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">📅</span> DATE
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-orange-500">⚡</span> PRIORITY
            </div>
            <div className="flex items-center">
              <span className="mr-1.5 text-blue-500">🔄</span> ACTION
            </div>
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {teams.map((team) => (
              <div key={team.id} className="grid grid-cols-6 p-3 border-b hover:bg-gray-50">
                <div className="text-[#333]">{selectedTicket || '-'}</div>
                <div className="text-[#333]">{team.name}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    team.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {team.status.toUpperCase()}
                  </span>
                </div>
                <div className="text-[#333]">May 19, 2025</div>
                <div className="text-[#333]">MEDIUM</div>
                <div>
                  <button 
                    onClick={() => handleTeamSelection(team.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedTeamId === team.id
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-green-200 text-green-800'
                    }`}
                    disabled={!selectedTicket || team.status !== 'available'}
                  >
                    {selectedTeamId === team.id ? 'Selected' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignTicket;