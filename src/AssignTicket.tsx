import React, { useState, useEffect } from 'react';
import './AssignTicket.css';

// Define TypeScript interfaces for our data
interface Agent {
  ticketId: number;
  name: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  selected?: boolean;
}

interface Team {
  ticketId: number;
  name: string;
  status: 'AVAILABLE' | 'UNAVAILABLE';
  date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  selected?: boolean;
}

interface SummaryBox {
  title: string;
  value: number;
  trend: number;
  icon: string;
  color: string;
}

const AssignTicket: React.FC = () => {
  // State for agents and teams
  const [agents, setAgents] = useState<Agent[]>([
    { 
      ticketId: 1001, 
      name: 'Lima, Ralph Carlo', 
      status: 'UNAVAILABLE', 
      date: 'March 25, 2025', 
      priority: 'MEDIUM',
      selected: false
    },
    { 
      ticketId: 1002, 
      name: 'Tuquib, Olan James', 
      status: 'AVAILABLE', 
      date: 'March 27, 2025', 
      priority: 'MEDIUM',
      selected: true
    }
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { 
      ticketId: 1001, 
      name: 'TEAM1', 
      status: 'UNAVAILABLE', 
      date: 'March 25, 2025', 
      priority: 'MEDIUM',
      selected: false
    }
  ]);

  // Summary data for the boxes
  const summaryData: SummaryBox[] = [
    {
      title: "Total Tickets",
      value: agents.length + teams.length,
      trend: 12,
      icon: "🎟️",
      color: "#4e73df"
    },
    {
      title: "Available Agents",
      value: agents.filter(agent => agent.status === 'AVAILABLE').length,
      trend: 8,
      icon: "👤",
      color: "#2a9d51"
    },
    {
      title: "Available Teams",
      value: teams.filter(team => team.status === 'AVAILABLE').length,
      trend: -5,
      icon: "👥",
      color: "#f6c23e"
    }
  ];

  // Function to handle selection for agents
  const handleAgentSelection = (ticketId: number) => {
    setAgents(agents.map(agent => {
      if (agent.ticketId === ticketId) {
        return { ...agent, selected: true };
      } else {
        return { ...agent, selected: false };
      }
    }));
  };

  // Function to handle selection for teams
  const handleTeamSelection = (ticketId: number) => {
    setTeams(teams.map(team => {
      if (team.ticketId === ticketId) {
        return { ...team, selected: true };
      } else {
        return { ...team, selected: false };
      }
    }));
  };

  return (
    <div className="ticket-content">
      <div className="assign-ticket-header">
        <h1 className="page-title">Assign Ticket</h1>
      </div>

      {/* Summary Boxes */}
      <div className="data-box-grid">
        {summaryData.map((box, index) => (
          <div className="summary-box" key={index}>
            <div className="summary-box-header">
              <div 
                className="summary-box-icon" 
                style={{ 
                  backgroundColor: `${box.color}20`, 
                  color: box.color 
                }}
              >
                <span>{box.icon}</span>
              </div>
              <div className="summary-box-title">{box.title}</div>
            </div>
            <div className="summary-box-value">{box.value}</div>
            <div className={`summary-box-trend ${box.trend >= 0 ? 'trend-up' : 'trend-down'}`}>
              {box.trend >= 0 ? '↑' : '↓'} {Math.abs(box.trend)}% from last week
            </div>
          </div>
        ))}
      </div>

      {/* Agent Section */}
      <div className="table-container">
        <h2 className="section-title">Select Agent</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th className="ticket-id-column">
                <div className="column-header">
                  <span className="icon">🎫</span> TICKET ID
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">👤</span> NAME
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">🔄</span> STATUS
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">📅</span> DATE
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">⚡</span> PRIORITY
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">🔄</span> ACTION
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">📝</span> NOTE
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.ticketId}>
                <td>{agent.ticketId}</td>
                <td>{agent.name}</td>
                <td>
                  <span className={`status ${agent.status.toLowerCase()}`}>
                    {agent.status.toLowerCase()}
                  </span>
                </td>
                <td>{agent.date}</td>
                <td>{agent.priority}</td>
                <td>
                  <button 
                    className={`select-button ${agent.selected ? 'selected' : ''}`}
                    onClick={() => handleAgentSelection(agent.ticketId)}
                  >
                    {agent.selected ? 'Selected' : 'Select'}
                  </button>
                </td>
                <td className="action-buttons">
                  <button className="edit-button">
                    <span className="icon">✏️</span>
                  </button>
                  <button className="delete-button">
                    <span className="icon">🗑️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Agent Cards for Mobile View */}
      <div className="mobile-card-container">
        {agents.map((agent) => (
          <div key={agent.ticketId} className={`ticket-info-box ${agent.priority.toLowerCase()}`}>
            <div className="ticket-info-content">
              <div className="ticket-info-title">{agent.name}</div>
              <div className="ticket-info-details">
                <div className="ticket-info-detail">
                  <span className="icon">🎫</span>
                  <span>{agent.ticketId}</span>
                </div>
                <div className="ticket-info-detail">
                  <span className="icon">🔄</span>
                  <span className={`status ${agent.status.toLowerCase()}`}>
                    {agent.status.toLowerCase()}
                  </span>
                </div>
                <div className="ticket-info-detail">
                  <span className="icon">📅</span>
                  <span>{agent.date}</span>
                </div>
              </div>
            </div>
            <div className="ticket-info-actions">
              <button 
                className={`select-button ${agent.selected ? 'selected' : ''}`}
                onClick={() => handleAgentSelection(agent.ticketId)}
              >
                {agent.selected ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Team Section */}
      <div className="table-container">
        <h2 className="section-title">Select Team</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th className="ticket-id-column">
                <div className="column-header">
                  <span className="icon">🎫</span> TICKET ID
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">👥</span> NAME
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">🔄</span> STATUS
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">📅</span> DATE
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">⚡</span> PRIORITY
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">🔄</span> ACTION
                </div>
              </th>
              <th>
                <div className="column-header">
                  <span className="icon">📝</span> NOTE
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.ticketId}>
                <td>{team.ticketId}</td>
                <td>{team.name}</td>
                <td>
                  <span className={`status ${team.status.toLowerCase()}`}>
                    {team.status.toLowerCase()}
                  </span>
                </td>
                <td>{team.date}</td>
                <td>{team.priority}</td>
                <td>
                  <button 
                    className={`select-button ${team.selected ? 'selected' : ''}`}
                    onClick={() => handleTeamSelection(team.ticketId)}
                  >
                    {team.selected ? 'Selected' : 'Select'}
                  </button>
                </td>
                <td className="action-buttons">
                  <button className="edit-button">
                    <span className="icon">✏️</span>
                  </button>
                  <button className="delete-button">
                    <span className="icon">🗑️</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Individual Team Cards for Mobile View */}
      <div className="mobile-card-container">
        {teams.map((team) => (
          <div key={team.ticketId} className={`ticket-info-box ${team.priority.toLowerCase()}`}>
            <div className="ticket-info-content">
              <div className="ticket-info-title">{team.name}</div>
              <div className="ticket-info-details">
                <div className="ticket-info-detail">
                  <span className="icon">🎫</span>
                  <span>{team.ticketId}</span>
                </div>
                <div className="ticket-info-detail">
                  <span className="icon">🔄</span>
                  <span className={`status ${team.status.toLowerCase()}`}>
                    {team.status.toLowerCase()}
                  </span>
                </div>
                <div className="ticket-info-detail">
                  <span className="icon">📅</span>
                  <span>{team.date}</span>
                </div>
              </div>
            </div>
            <div className="ticket-info-actions">
              <button 
                className={`select-button ${team.selected ? 'selected' : ''}`}
                onClick={() => handleTeamSelection(team.ticketId)}
              >
                {team.selected ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignTicket;