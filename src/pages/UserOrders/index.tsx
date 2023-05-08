import { useNavigate } from "react-router-dom";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

export interface UserOrdersProps {

}

const UserOrders: React.FC<UserOrdersProps> = (props) => {
  const auth = useAuthentication();
  const navigate = useNavigate();

  if (auth.userIsLoading) {
    return (
      <>Loading</>
    )
  }

  if (!auth.user) {
    return (
      <>No user</>
    )
  }

  return (
    <Page>
      <Panel title='Orders' displayBackNavigation>
        {auth.user.orders.map((order) => (
          <div onClick={() => navigate(`/user/orders/${order.id}`)}>
            {order.items.length} products
            <br />
            {order.status}
          </div>
        ))}
      </Panel>
    </Page>
  )
}

export default UserOrders;