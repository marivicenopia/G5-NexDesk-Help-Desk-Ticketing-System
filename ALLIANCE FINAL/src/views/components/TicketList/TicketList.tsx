// import React, { useState, useEffect } from 'react';
// // import TicketItem from '../TicketItem';
// import type { Ticket } from '../../../types/ticket';
// import { dummyTickets } from '../../../data/dummyTickets';

// const TicketList: React.FC = () => {
//     const [tickets, setTickets] = useState<Ticket[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         setTimeout(() => {
//             try {
//                 setTickets(dummyTickets);
//                 setLoading(false);
//             } catch (err: any) {
//                 setError('Failed to load tickets.');
//                 setLoading(false);
//             }
//         }, 500);
//     }, [])

//     if (loading) {
//         return <div>Error: {error}</div>
//     }

//     return (
//         <div style={{ maxWidth: '100%', padding: '1rem' }}>
//             <h2 className="text-xl font-bold mb-4">Ticket List</h2>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
//                 {tickets.length > 0 ? (
//                     tickets.map((ticket) => (
//                         // <TicketItem key={ticket.id} ticket={ticket} />
//                     ))
//                 ) : (
//                     <p>No tickets found.</p>
//                 )}
//             </div>
//         </div>
//     )
// };

// export default TicketList; 