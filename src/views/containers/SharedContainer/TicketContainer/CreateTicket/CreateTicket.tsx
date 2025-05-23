import React, { useState } from "react";
import { TicketService } from "../../../../../services/ticket/TicketService";

type PriorityOption = "low" | "medium" | "high" | "urgent";
type DepartmentOption =
  | "Facility Management"
  | "IT Support"
  | "Human Resources"
  | "Finance";

const CreateTicket: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityOption>("medium");
  const [department, setDepartment] = useState<DepartmentOption>("IT Support");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newTicket = await TicketService.create({
        title,
        description,
        priority,
        department,
      });
      alert(`Ticket created successfully with ID: ${newTicket.id}`);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDepartment("IT Support");
    } catch (err: any) {
      setError(err.message || "Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-2xl font-semibold mb-6">Create Ticket</h2>

      <label className="block mb-4">
        Title
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-lg"
          placeholder="Ticket title"
        />
      </label>

      <label className="block mb-4">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-lg"
          placeholder="Describe the issue"
          rows={3}
        />
      </label>

      <label className="block mb-4">
        Priority
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as PriorityOption)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-lg"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="Urgent">Urgent</option>
        </select>
      </label>

      <label className="block mb-6">
        Department
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value as DepartmentOption)}
          required
          className="w-full border border-gray-300 rounded px-4 py-2 mt-1 text-lg"
        >
          <option value="Facility Management">Facility Management</option>
          <option value="IT Support">IT Support</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Finance">Finance</option>
        </select>
      </label>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-lg font-semibold"
      >
        {loading ? "Creating..." : "Create Ticket"}
      </button>
    </form>
  );
};

export default CreateTicket;
