import TicketTable from '../../../components/Table/TicketTable';
import { ticketTableSchema as ticketColumns } from '../../../../config/tableSchema';
import { dummyTickets } from '../../../../data/dummyTickets';

const ViewTicket: React.FC = () => {
    return (
        <div className="overflow-x-auto">
            <TicketTable data={dummyTickets} columns={ticketColumns} title="Ticket Data" />
        </div>
    );
};

export default ViewTicket;

