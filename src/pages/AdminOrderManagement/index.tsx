import { useNavigate } from "react-router-dom";
import AdminPanel from "../../layouts/AdminPanel";
import AppTable from "../../layouts/AppTable";
import AppTableRow from "../../layouts/AppTableRow";
import Page from "../../layouts/Page";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { ClientOrder } from "../../models/order.model";
import { useGetOrdersQuery } from "../../services/api/coreApi";
import './admin-order-management.scss';
import { useRedirection } from "../../utils/hooks/useRedirection";
import { ReactNode } from "react";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import useSelectInputField, { SelectInputFieldOption } from "../../middleware/hooks/select-input-field-hook";
import useSearchParamState from "../../middleware/hooks/useSearchParamState";

const statusOptions: SelectInputFieldOption[] = [
  {
    title: 'All',
    value: 'all',
  },
  {
    title: 'Open',
    value: 'open',
  },
  {
    title: 'Canceled',
    value: 'canceled',
  },
  {
    title: 'Archive',
    value: 'archive',
  }
]

const AdminOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const redirect = useRedirection();
  const { data: orders = [] } = useGetOrdersQuery();

  const {
    paramCluster,
    clear: clearSearchCluster,
    urlSearchParams,
    applySearchCluster,
  } = useSearchParamState();

  const {
    selections,
    elementIsSelected,
    handleSelectionEvent,
    allElementsAreSelected,
    handleElementBulkSelection,
    deselectAllSelections,
  } = useSequentialElementSelection(orders, {
    identifier: (order) => order.id,
  });

  const bulkSelectionHandler: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    handleElementBulkSelection();
  }

  const orderDoubleClickHandler = (order: ClientOrder) => () => {
    navigate(`/orders/${order.id}/inspect`);
  }

  const changeDebouncingTimeout = 500;

  const stateFilterSelector = useSelectInputField({
    label: 'State',
    required: true,
    value: statusOptions.find(filter => filter.value === paramCluster.hasStatus.value) ?? statusOptions[0],
    options: statusOptions,
    onChange(state) {
      if (state.value === statusOptions[0].value) {
        paramCluster.hasStatus.remove().apply()
        return;
      }

      paramCluster.hasStatus.set(state.value).apply();
    }
  });

  const expStartDate = useTextInputField({
    required: true,
    label: 'Creation Range',
    type: 'date',
    inputPrefix: 'From:',
    className: 'b',
  })

  const expEndDate = useTextInputField({
    inputPrefix: 'To:',
    type: 'date',
    className: 't'
  })

  const headerTools = (
    <>
      {selections.length === 1 && <button className="panel-tool highlight" onClick={redirect(`/orders/${selections[0].id}/inspect`)}>Inspect</button>}
    </>
  )

  const getIdLastPart = (uuid: string) => {
    const split = uuid.split('-');
    return split[split.length - 1];
  }

  const subheader: ReactNode[] = [
    <span>Showing <span className='highlight'>{ orders.length }</span> orders</span>,
  ]

  const extensions = (
    <div className='admin-panel-management-extensions'>
      <header>
        <span>Filters</span>
      </header>
      <div className='filter-content'>
        <div>
          {stateFilterSelector.render()}
        </div>
        <div className='order-date-range'>
          {expStartDate.render()}
          {expEndDate.render()}
        </div>
      </div>
    </div>
  )

  return (
    <Page id='admin-order-management' onClick={deselectAllSelections}>
      <AdminPanel title="Order Management" headerTools={headerTools} subheader={subheader} extensions={extensions}>
        <AppTable useSelectionCheckbox>
          <thead>
            <AppTableRow
              aria-selected={allElementsAreSelected()}
              onCheckboxClick={bulkSelectionHandler}
            >
              <td>ID</td>
              <td>User</td>
              <td>Creation</td>
              <td>Status</td>
            </AppTableRow>
          </thead>
          <tbody>
            { orders?.map((order => (
              <AppTableRow 
                onClick={handleSelectionEvent(order)} 
                aria-selected={elementIsSelected(order)}
                onDoubleClick={orderDoubleClickHandler(order)}
              >
                <td>{ getIdLastPart(order.id) }</td>
                <td>{ order.author.email }</td>
                <td>{ new Date(order.creationDate).toLocaleString() }</td>
                <td className="status" data-status={order.status}>
                  <div className="container">
                    { order.status }
                  </div>
                </td>
              </AppTableRow>
            ))) }
          </tbody>
        </AppTable>
      </AdminPanel>
    </Page>
  );
}

export default AdminOrderManagement;