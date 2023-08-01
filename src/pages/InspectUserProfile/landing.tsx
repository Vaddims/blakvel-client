import { useParams } from "react-router-dom";
import useGravatarAvatar from "../../middleware/hooks/gravatar-avatar-hook";
import { useGetUsersQuery } from "../../services/api/coreApi";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSelectInputField from "../../middleware/hooks/select-input-field-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faBox, faHeadset, faMoneyCheck, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import AvatarDisplayer from "../../components/AvatarDisplayer";
import ProductCatalog, { ProductCatalogElementSize } from "../../components/ProductCatalog";
import SequentialSectionContainer from "../../layouts/SequentialSectionContainer";
import SequentialSection from "../../layouts/SequentialSection";

const roleOptions = [
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
    value: roleOptions.find(roleOption => roleOption.value === cu?.role),
    trackValue: true,
    options: roleOptions,
  })

  const { data: avatar } = useGravatarAvatar({
    skip: !cu,
    email: cu?.email,
  })

  if (!cu) {
    return (
      <div></div>
    )
  }

  const getIdLastPart = (uuid: string) => {
    const split = uuid.split('-');
    return split[split.length - 1];
  }

  const renderNoData = (icon: IconDefinition, title: string) => (
    <div className="no-data-container">
      <FontAwesomeIcon icon={icon} className="icon" size='3x' />
      <div className="info">
        <h3 className="title">{title}</h3>
      </div>
    </div>
  )

  const renderRecentOrdersSection = () => {
    if (cu.orders.length === 0) {
      return renderNoData(faBox, 'No recent orders');
    }

    return cu.orders.map(order => (
      <div className="inline-order">
        <div className="information">
          <span className="id">{getIdLastPart(order.id)}</span>
          <span className="quantity-information">{order.items.length} elements</span>
        </div>
        <div className="status" data-status={order.status}>
          <div className="container">
            { order.status }
          </div>
        </div>
      </div>
    ));
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
      <SequentialSectionContainer>
        <SequentialSection title='Recent Orders' className="recent-orders">
          {renderRecentOrdersSection()}
        </SequentialSection>
        <SequentialSection title="Recent Sales" className="recent-sales">
          <ProductCatalog 
            products={cu?.sales as any ?? []}
            productCardSize={ProductCatalogElementSize.Small}
          >
            {renderNoData(faMoneyCheck, 'No recent sales')}
          </ProductCatalog>
        </SequentialSection>
        <SequentialSection title="Recent Support Messages" className="recent-support-messages">
          {renderNoData(faHeadset, 'No recent support messages')}
        </SequentialSection>
      </SequentialSectionContainer>
    </section>
  )
}

export default InspectUserLandingProfile;