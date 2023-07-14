import { useParams } from "react-router-dom";
import useGravatarAvatar from "../../middleware/hooks/gravatar-avatar-hook";
import useUserGravatarAvatar from "../../middleware/hooks/user-gravatar-avatar-hook";
import { useGetUsersQuery } from "../../services/api/usersApi";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSelectInputField, { defaultSelectInputFieldOption } from "../../middleware/hooks/select-input-field-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faHeadset, faMoneyCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import AvatarDisplayer from "../../components/AvatarDisplayer";

const ops = [
  {
    title: 'User',
    value: 'user',
  },
  {
    title: 'Admin',
    value: 'admin',
  }
];

const InspectUserLandingProfile: React.FC = () => {
  const { id } = useParams();
  const { user: authenticatedUser } = useAuthentication();
  const { data: users = [] } = useGetUsersQuery();
  const cu = users.find(user => user.id === id) ?? authenticatedUser;

  const firstNameInputField = useTextInputField({
    label: 'Full Name',
    placeholder: 'Name',
    value: cu?.fullname.first,
    anchor: cu?.fullname.first,
    required: true,
    trackValue: true,
    className: 'r',
  })

  const lastNameInputField = useTextInputField({
    placeholder: 'Surname',
    value: cu?.fullname.last,
    anchor: cu?.fullname.last,
    required: true,
    trackValue: true,
    className: 'l'
  })

  const emailInputField = useTextInputField({
    label: 'Email',
    required: true,
    value: cu?.email,
    trackValue: true,
  })

  const roleInputField = useSelectInputField({
    required: true,
    label: 'Role',
    value: ops.find(op => op.value === cu?.role),
    trackValue: true,
    options: ops,
  })

  const { data: avatar } = useGravatarAvatar({
    skip: !cu,
    email: cu?.email,
  })

  const getIdLastPart = (uuid: string) => {
    const split = uuid.split('-');
    return split[split.length - 1];
  }

  return (
    <section className="inspect-user-landing-profile">
      <div className="general-info">
        <header>
          <AvatarDisplayer src={avatar} className="avatar" noUserIconSize="4x" />
          <div className="inspection-container">
            <div className="inspect-full-name">
              {firstNameInputField.render()}
              {lastNameInputField.render()}
            </div>
            {emailInputField.render()}
            {roleInputField.render()}
          </div>
        </header>
      </div>
      <div className="info-rows">
        <section className="info-row">
          <header className="row-divider">
            <div className="h-d">
              <span>Recent Orders</span>
              <button className="inspect-all-orders-action">Show All</button>
            </div>
            <hr className="divider" />
          </header>
          <div className="cluster newest-orders">
            {(cu?.orders.length ?? 0) > 0 ? cu?.orders.map(order => (
              <div className="or">
                <div className="or-l">
                  <span className="or-id">{getIdLastPart(order.id)}</span>
                  <span className="or-i">{order.items.length} elements</span>
                </div>
                <div className="status" data-status={order.status}>
                  <div className="container">
                    { order.status }
                  </div>
                </div>
              </div>
            )) : (
              <div className="no-data-container">
                <FontAwesomeIcon icon={faBox} className="icon" size='3x' />
                <div className="info">
                  <h1 className="title">There are currently no orders to display</h1>
                  {/* <button className="action">Browse Catalog</button> */}
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="info-row">
          <header className="row-divider">
            <div className="h-d">
              <span>Recent Sales</span>
              <button className="inspect-all-orders-action">Show All</button>
            </div>
            <hr className="divider" />
          </header>
          <div className="cluster newest-sales">
            <div className="no-data-container">
              <FontAwesomeIcon icon={faMoneyCheck} className="icon" size='3x' />
              <div className="info">
                <h1 className="title">There are currently no sales to display</h1>
                {/* <button className="action">Sell Now</button> */}
              </div>
            </div>
          </div>
        </section>
        <section className="info-row">
          <header className="row-divider">
            <div className="h-d">
              <span>Recent Support Messages</span>
              <button className="inspect-all-orders-action">Show All</button>
            </div>
            <hr className="divider" />
          </header>
          <div className="cluster newest-support-messages">
            <div className="no-data-container"> 
              <FontAwesomeIcon icon={faHeadset} className="icon" size='3x' />
              <div className="info">
                <h1 className="title">There are currently no support messages to display</h1>
                {/* <button className="action">Contact support</button> */}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default InspectUserLandingProfile;