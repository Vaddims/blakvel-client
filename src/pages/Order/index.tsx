import { useParams } from "react-router-dom";
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

const Order: React.FC = () => {
  const { orderId } = useParams();
  const auth = useAuthentication();

  if (!auth.user) {
    return (
      <>Loading</>
    )
  }

  const order = auth.user.orders.find(order => order.id === orderId);
  if (!order) {
    return (
      <>Order not found</>
    )
  }

  return (
    <Page id='order-overview'>
      <Panel title='Overview Order' displayBackNavigation>
        {order.id}
        <br />
        order is {order.status}
        <div>
          {order.items.map(item => (
            <>
              <div>
                {item.product.name}
                <br />
                {item.quantity}
                <br />
                {item.archivedPrice}
              </div>
              <br />
            </>
          ))}
        </div>
        <div>
          City: {order.shippingAddress.city}
          <br />
          Country: {order.shippingAddress.country}
          <br />
          Line 1: {order.shippingAddress.line1}
          <br />
          Line 2: {order.shippingAddress.line2}
          <br />
          Postal Code: {order.shippingAddress.postalCode}
          <br />
          State: {order.shippingAddress.state}
        </div>
      </Panel>
    </Page>
  )
}

export default Order;