import { useNavigate } from "react-router-dom";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { useElementSelection } from "../../middleware/hooks/useElementSelection";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";

const Orders = () => {
  const { user, userIsLoading } = useAuthentication();
  const navigate = useNavigate();
  const orderSelection = useSequentialElementSelection(user?.orders ?? [], {
    identifier: (order) => order.id,
  })

  if (userIsLoading) {
    return (
      <h1>loading</h1>
    )
  }

  if (!user) {
    return (
      <h1>Forbidden</h1>
    )
  }

  return (
    <Page>
      <Panel title='Orders' displayBackNavigation>
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow
              onCheckboxClick={() => orderSelection.handleElementBulkSelection()}
              aria-selected={orderSelection.allElementsAreSelected()}
            >
              <td>Order</td>
            </AppTableRow>
          </thead>
          <tbody>
            {user.orders.map(order => (
              <AppTableRow
                onClick={orderSelection.handleSelectionEvent(order)}
                aria-selected={orderSelection.elementIsSelected(order)}
                onDoubleClick={() => navigate(`/user/orders/${order.id}`)}>
                <td>{ order.id }</td>
              </AppTableRow>
            ))}
          </tbody>
        </AppTable>
      </Panel>
    </Page>
  );
}

export default Orders;