import { ReactNode } from "react";
import AdminPanel from "../../layouts/AdminPanel";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import Page from "../../layouts/Page"
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { useGetUsersQuery } from "../../services/api/usersApi";
import './admin-user-management.scss';
import useSearchParamState from "../../middleware/hooks/useSearchParamState";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import { faEdit, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "../../middleware/hooks/input-field-hook";
import useSelectInputField from "../../middleware/hooks/select-input-field-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRedirection } from "../../utils/hooks/useRedirection";

const userStateFilter = {
  all: {
    title: 'All',
    value: 'all',
  },
  admin: {
    title: 'Admin',
    value: 'admin',
  },
  user: {
    title: 'User',
    value: 'user',
  }
}

const findUserRoleFilter = (v: string) => {
  return Object.values(userStateFilter).find(filter => filter.value === v);
}

const AdminUserManagement: React.FC = () => {
  const { data: users = [] } = useGetUsersQuery();
  const redirect = useRedirection();

  const {
    paramCluster,
    clear: clearSearchCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();

  const {
    selections,
    allElementsAreSelected,
    handleElementBulkSelection,
    handleSelectionEvent,
    elementIsSelected,
    deselectAllSelections,
  } = useSequentialElementSelection(users, {
    identifier: (user) => user.id,
  })

  const globalSearchInput = useTextInputField({
    inputIcon: faSearch,
    placeholder: 'Search',
    value: paramCluster.search.value ?? '',
    trackValue: true,
    validationTimings: [InputField.ValidationTiming.Submit],
    changeDebouncingTimeout: 500,
    onChange(data) {
      paramCluster.search.set(data.length === 0 ? null : data).apply();
    },
    onSubmit(data) {
      paramCluster.search.set(data.length === 0 ? null : data);
      applySearchCluster();
    },
    onClear() {
      paramCluster.search.set(null);
      applySearchCluster();
    }
  });

  const changeDebouncingTimeout = 500;

  const userRoleFilterSelector = useSelectInputField({
    label: 'Role',
    required: true,
    value: paramCluster.hasRole.value ? findUserRoleFilter(paramCluster.hasRole.value) : userStateFilter.all,
    options: Object.values(userStateFilter),
    onChange(state) {
      if (state.value === userStateFilter.all.value) {
        paramCluster.hasRole.remove().apply();
        return;
      }

      paramCluster.hasRole.set(state.value).apply();
    }
  });

  const minOrderQuantityInput = useTextInputField({
    label: 'Orders',
    required: true,
    placeholder: '-',
    inputPrefix: 'Min:',
    className: 'r',
    hideClear: true,
    value: paramCluster.minOrders.value ?? '',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.minOrders.set(state).apply();
    }
  });

  const maxOrderQuantityInput = useTextInputField({
    inputPrefix: 'Max:',
    hideClear: true,
    placeholder: '-',
    className: 'l',
    value: paramCluster.maxOrders.value ?? '',
    changeDebouncingTimeout,
    onChange(state) {
      paramCluster.maxOrders.set(state).apply();
    }
  });

  const extensions = (
    <div className='admin-panel-management-extensions'>
      <header>
        <span>Filters</span>
      </header>
      <div className='filter-content'>
        <div className='order-role-selector'>
          {userRoleFilterSelector.render()}
        </div>
        <div className='order-quantity-range'>
          { minOrderQuantityInput.render() }
          { maxOrderQuantityInput.render() }
        </div>
      </div>
    </div>
  )

  const selectionHeaderTools = [
    <button className="panel-tool delete">
      <FontAwesomeIcon icon={faTrash} />
      Delete
    </button>
  ];

  if (selections.length === 1) {
    selectionHeaderTools.unshift(
      <button className="panel-tool edit highlight" onClick={redirect(`/users/${selections[0].id}/inspect`)}>
        <FontAwesomeIcon icon={faEdit} />
        Edit
      </button>
    )
  }

  const bulkSelectionHandler: React.MouseEventHandler = (event) => {
    event.stopPropagation();
    handleElementBulkSelection();
  }

  const subheader: ReactNode[] = [
    <span>Showing <span className='highlight'>{ users.length }</span> users</span>,
  ]

  const selectionHeaderCentralTools = [
    globalSearchInput.render(),
  ]

  const panelTools = selections.length > 0 ? selectionHeaderTools : null;

  return (
    <Page id='admin-user-management' onClick={deselectAllSelections}>
      <AdminPanel title='User Management' subheader={subheader} headerCenterTools={selectionHeaderCentralTools} extensions={extensions} headerTools={panelTools}>
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow 
              onCheckboxClick={bulkSelectionHandler}
              aria-selected={allElementsAreSelected()}
            >
              <td>User</td>
              <td>Role</td>
              <td>Orders</td>
            </AppTableRow>
          </thead>
          <tbody>
            { users.map(user => (
              <AppTableRow
                onClick={handleSelectionEvent(user)}
                aria-selected={elementIsSelected(user)}
                onDoubleClick={redirect(`/users/${user.id}/inspect`)}
              >
                <td>{ user.email }</td>
                <td className="role">{ user.role }</td>
                <td>{ user.orders.length }</td>
              </AppTableRow>
            )) }
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  )
}

export default AdminUserManagement;