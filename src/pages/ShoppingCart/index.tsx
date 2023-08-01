import Panel from "../../layouts/Panel";
import Page from "../../layouts/Page";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import './shopping-cart.scss';
import { useRedirection } from "../../utils/hooks/useRedirection";
import { useCreateCheckoutSessionMutation, useUpdateUserMutation } from "../../services/api/coreApi";

const ShoppingCart: React.FC = () => {
  const { user } = useAuthentication();
  const redirect = useRedirection();
  const [ updateUser ] = useUpdateUserMutation();
  const [ createCheckoutSession ] = useCreateCheckoutSessionMutation();
  const navigate = useNavigate();

  if (!user) {
    return (
      <>Loading</>
    )
  }

  if (!user) {
    return (
      <>Forbidden</>
    )
  }

  const onItemRemove = (productId: string): React.MouseEventHandler<HTMLButtonElement> => async (event) => {
    event.stopPropagation();
    const filteredItems = user.shoppingCart.filter(item => item.product.id !== productId);
    try {
      await updateUser({
        userId: user.id,
        shoppingCart: filteredItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      })
    } catch {

    }
  }

  const decreaceItemQuantity = (providedItem: typeof user.shoppingCart[number]) => async () => {
    const items = user.shoppingCart.map(item => item.product.id === providedItem.product.id ? (
      {
        product: item.product,
        quantity: providedItem.quantity - 1,
      }
    ) : item)

    await updateUser({
      userId: user.id,
      shoppingCart: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    })
  }

  const increaseItemQuantity = (providedItem: typeof user.shoppingCart[number]) => async () => {
    const items = user.shoppingCart.map(item => item.product.id === providedItem.product.id ? (
      {
        product: item.product,
        quantity: providedItem.quantity + 1,
      }
    ) : item)

    await updateUser({
      userId: user.id,
      shoppingCart: items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    })
  }

  const checkout = async () => {
    const data = await createCheckoutSession().unwrap();
    window.location.href = data.url;
  }

  return (
    <Page id='shopping-cart'>
      <Panel
        title='Cart'
        displayBackNavigation
      >
        <section className='items-overview'>
          <table>
            <thead>
              <tr>
                <th className="product-details">Product Details</th>
                <th className="quantity">Quantity</th>
                <th className="price">Price</th>
                <th className="total">Total</th>
              </tr>
            </thead>
            <tbody>
              {user.shoppingCart.map((item) => (
                <tr>
                  <th>
                    <div className="item-overview">
                      <div className="media-wrapper" onClick={redirect(`/products/${item.product.id}`)}>
                        <img src={`/api/media/${item.product.urn.thumbnail}`} alt="" />
                      </div>
                      <div className="product-details">
                        <h2>{item.product.name}</h2>
                        <button onClick={onItemRemove(item.product.id)}>Remove</button>
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="product-quantity">
                      <button onClick={decreaceItemQuantity(item)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={increaseItemQuantity(item)}>+</button>
                    </div>
                  </th>
                  <th>
                    ${ (item.product.discountPrice ?? item.product.price).toFixed(2) }
                    <br />
                    {item.product.discountPrice && (
                      <span className="initial-price">${item.product.price.toFixed(2)}</span>
                    )}
                  </th>
                  <th>${((item.product.discountPrice ?? item.product.price) * item.quantity).toFixed(2)}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <aside className="checkout-overview">
          <header>
            <h2>Order Summary</h2>
            <hr />
            <div className="subheader">
              <h4>Subtotal ({user.shoppingCart.length} items)</h4>
              <h4>
                ${user.shoppingCart.reduce((totalPrice, item) => (
                  totalPrice + item.quantity * item.product.price), 
                  0
                ).toFixed(2)}
              </h4>
            </div>
            {user.shoppingCart.reduce((totalPrice, item) => (
              item.product.discountPrice ? totalPrice + item.quantity * (item.product.price - item.product.discountPrice) : totalPrice
              ), 
              0
            ) !== 0 && (
              <div className="subheader">
                <h4>Discount</h4>
                <h4>
                  ${user.shoppingCart.reduce((totalPrice, item) => (
                    item.product.discountPrice ? totalPrice + item.quantity * (item.product.price - item.product.discountPrice) : totalPrice
                    ), 
                    0
                  ).toFixed(2)}
                </h4>
              </div>
            )}
            <hr />
            <div className="subheader">
              <h4>Total Cost</h4>
              <h4>
                ${user.shoppingCart.reduce((totalPrice, item) => (
                  totalPrice + item.quantity * (item.product.discountPrice ?? item.product.price)), 
                  0
                ).toFixed(2)}
              </h4>
            </div>
            <button className="checkout-action" onClick={checkout}>Checkout</button>
          </header>
        </aside>
      </Panel>
    </Page>
  );
}

export default ShoppingCart;