import { useParams } from "react-router-dom"
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { useGetOrderQuery } from "../../services/api/coreApi";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import './order.scss';

const Order: React.FC = () => {
  const { orderId = '' } = useParams();
  const {
    isLoading,
    data: order,
  } = useGetOrderQuery(orderId);

  if (isLoading) {
    return (
      <h1>loading</h1>
    )
  }

  if (!order) {
    return (
      <h1>error</h1>
    )
  }

  return (
    <Page id='order'>
      <Panel title='Order' displayBackNavigation>
        <div className="subheader">
          <div className="order-status">
            <span className="title">Status:</span>
            <span className="status">{ order.status }</span>
          </div>
          <div className="order-date">
            <span className="title">Order date:</span>
            <span className="date">{ new Date(order.creationDate).toLocaleString() }</span>
          </div>
          <div className="estimated-delivery">
            <span className="title">Estimated delivery:</span>
            <span>Not implemented</span>
          </div>
        </div>
        <hr />
        <AppTable>
          <tbody>
            {order.items.map((item) => (
              <AppTableRow>
                <td>
                  <div className="item-overview">
                    <div className="media-wrapper">
                      <img src={`/api/media/${item.product.urn.thumbnail}`} alt="" />
                    </div>
                    <div className="product-details">
                      <h2>{item.product.name}</h2>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="item-info">
                    <span className="price">${ item.archivedPrice }</span>
                    <span className="qty">Qty: { item.quantity }</span>
                  </div>
                </td>
              </AppTableRow>
            ))}
          </tbody>
        </AppTable>
        <hr />
        <div className="general-info">
          <div className="user-info test">
            <span className="info-representer">Buyer</span>
            <div className="user">
              <span className="info-subrepresenter">Info</span>
              <span>{ order.author.role }</span>
              <span>{ order.author.email }</span>
            </div>
          </div>
          <div className="payment-info test">
            <span className="info-representer">Payment</span>
            <div className="payment">
              <span className="info-subrepresenter">Method</span>
              <span>Card</span>
            </div>
          </div>
          <div className="delivery-info test">
            <span className="info-representer">Delivery</span>
            <div className="address">
              <span className="info-subrepresenter">Address</span>
              <span>{order.shippingAddress.line1}</span>
              <span>{order.shippingAddress.line2}</span>
              <span>{order.shippingAddress.city}</span>
              <span>{order.shippingAddress.postalCode}</span>
              <span>{order.shippingAddress.line1}</span>
            </div>
          </div>
        </div>
        <hr />
        <div className="extra-info">

        </div>
      </Panel>
    </Page>
  )
}

export default Order;