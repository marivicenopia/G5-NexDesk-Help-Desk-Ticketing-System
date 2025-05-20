import UserTable from "../../../components/Table/UserTable/UserTable";
import { userTableSchema as userColumns } from '../../../../config/tableSchema';
import { dummyUsers } from '../../../../data/dummyUsers';

const UserManagementContainer: React.FC = () => {
    return (
        <div className="flex justify-center items-start w-full min-h-screen p-2">
            <div className="max-w-4xl w-full bg-white/5">
                <UserTable data={dummyUsers} columns={userColumns} title="User Data" />
            </div>
        </div>
    );
};

export default UserManagementContainer;

