import { useNavigate } from "react-router-dom";
import AdminPanel from "../../layouts/AdminPanel";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import Page from "../../layouts/Page";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { ClientOrder } from "../../models/order.model";
import { useGetOrdersQuery } from "../../services/api/usersApi";
import './admin-order-management.scss';

const AdminOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const { data: orders = [] } = useGetOrdersQuery();

  const {
    elementIsSelected,
    handleSelectionEvent,
    allElementsAreSelected,
    handleElementBulkSelection,
    deselectAllSelections,
  } = useSequentialElementSelection(orders, {
    identifier: (order) => order.id,
  });

  const bulkSelectionHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    handleElementBulkSelection();
  }

  const orderDoubleClickHandler = (order: ClientOrder) => () => {
    navigate(`/orders/${order.id}/inspect`);
  }

  return (
    <Page id='admin-order-management' onClick={deselectAllSelections}>
      <AdminPanel title="Order Management">
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow
              aria-selected={allElementsAreSelected()}
              onCheckboxClick={bulkSelectionHandler}
            >
              <td>User</td>
              <td>Creation</td>
              <td>Status</td>
            </AppTableRow>
          </thead>
          <tbody>
            { orders?.map((order => (
              <AppTableRow 
                onClick={handleSelectionEvent(order)} 
                aria-selected={elementIsSelected(order)}
                onDoubleClick={orderDoubleClickHandler(order)}
              >
                <td>{ order.author.email }</td>
                <td>{ new Date(order.creationDate).toLocaleString() }</td>
                <td className="status" data-status={order.status}>
                  <div className="container">
                    { order.status }
                  </div>
                </td>
              </AppTableRow>
            ))) }
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  );
}

export default AdminOrderManagement;