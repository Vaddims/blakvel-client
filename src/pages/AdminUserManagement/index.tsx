import AdminPanel from "../../layouts/AdminPanel";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import Page from "../../layouts/Page"
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { useGetUsersQuery } from "../../services/api/usersApi";
import './admin-user-management.scss';

const AdminUserManagement: React.FC = () => {
  const { data: users = [] } = useGetUsersQuery();

  const {
    allElementsAreSelected,
    handleElementBulkSelection,
    handleSelectionEvent,
    elementIsSelected,
    deselectAllSelections,
  } = useSequentialElementSelection(users, {
    identifier: (user) => user.id,
  })

  const bulkSelectionHandler: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    handleElementBulkSelection();
  }

  return (
    <Page id='admin-user-management' onClick={deselectAllSelections}>
      <AdminPanel title='User Management'>
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow 
              onCheckboxClick={bulkSelectionHandler}
              aria-selected={allElementsAreSelected()}
            >
              <td>User</td>
              <td>Role</td>
              <td>Orders</td>
            </AppTableRow>
          </thead>
          <tbody>
            { users.map(user => (
              <AppTableRow
                onClick={handleSelectionEvent(user)}
                aria-selected={elementIsSelected(user)}
              >
                <td>{ user.email }</td>
                <td className="role">{ user.role }</td>
                <td>{ user.orders.length }</td>
              </AppTableRow>
            )) }
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  )
}

export default AdminUserManagement;