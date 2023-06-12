import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { useRedirection } from "../../utils/hooks/useRedirection";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";

const UserShoppingCartComposition: React.FC = () => {
  const redirect = useRedirection();
  const authentication = useAuthentication();

  if (!authentication.user) {
    return (
      <></>
    )
  }

  return (
    <li 
      className="user-shopping-cart"
      onClick={redirect(`/user/cart`)} 
      title='Shopping Cart'
    >
      <div className="shopping-cart" data-shopping-cart-item-quantity={authentication.user.shoppingCart.length}>
        <FontAwesomeIcon icon={faCartShopping} size="lg" />
      </div>
    </li>
  );
}

export default UserShoppingCartComposition;