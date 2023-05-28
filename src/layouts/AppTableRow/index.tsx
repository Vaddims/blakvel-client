import { useContext } from "react";
import { AppTableContext } from "../AppTable";
import CheckboxField from "../../components/CheckboxField";

export interface AppTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  onCheckboxClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const AppTableRow: React.FC<AppTableRowProps> = (props) => {
  const {
    children,
    onCheckboxClick,
    ...trProps
  } = props;

  const {
    useSelectionCheckbox,
  } = useContext(AppTableContext);

  return (
    <tr {...trProps}>
      { useSelectionCheckbox && (
        <td className='app-table-row-checkbox'>
          <div className="stablizer">
            <CheckboxField label='' select={!!trProps['aria-selected']} onClick={onCheckboxClick} />
          </div>
        </td>
      ) }
      { children }
    </tr>
  );
}

export default AppTableRow;