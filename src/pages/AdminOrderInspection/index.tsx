import { useParams } from "react-router-dom"
import Page from "../../layouts/Page"
import Panel from "../../layouts/Panel"
import { useGetOrderQuery } from "../../services/api/usersApi";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import './admin-order-inspection.scss';
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSelectInputField from "../../middleware/hooks/select-input-field-hook";
import { OrderStatus } from "../../models/order.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const statusOptions = {
  open: {
    title: 'Open',
    value: OrderStatus.Open,
  },
  canceled: {
    title: 'Canceled',
    value: OrderStatus.Canceled,
  },
  archive: {
    title: 'Archive',
    value: OrderStatus.Archived,
  }
}

const AdminOrderInspection: React.FC = () => {
  const { orderId = '' } = useParams();
  const {
    isLoading,
    data: order,
  } = useGetOrderQuery(orderId);

  const status = useSelectInputField({
    label: 'Status',
    options: Object.values(statusOptions),
    required: true,
    value: [...Object.values(statusOptions)].find(opt => opt.value === order?.status),
    trackValue: true,
  })

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


  const selectionHeaderTools = (
    <>
      <button className="panel-tool edit highlight">
        <FontAwesomeIcon icon={faEdit} />
        Update
      </button>
      <button className="panel-tool delete">
        <FontAwesomeIcon icon={faTrash} />
        Delete Order
      </button>
    </>
  );

  return (
    <Page id='admin-order-inspection'>
      <Panel title='Inspect Order' displayBackNavigation headerTools={selectionHeaderTools}>
        <div className="subheader">
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
        <div className="input-fields-section">
          {status.render()}
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
                    <span className="price">${ (item.archivedPrice * item.quantity).toFixed(2) }</span>
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

export default AdminOrderInspection;