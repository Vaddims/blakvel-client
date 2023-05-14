import { createContext } from 'react';
import './app-table.scss';

export interface AppTableProps extends React.DetailedHTMLProps<React.TableHTMLAttributes<HTMLTableElement>, HTMLTableElement> {
  readonly useSelectionCheckbox?: boolean;
}

interface AppTableContextState {
  readonly useSelectionCheckbox: boolean;
}

export const AppTableContext = createContext<AppTableContextState>({
  useSelectionCheckbox: false,
});

const AppTable: React.FC<AppTableProps> = (props) => {
  const {
    useSelectionCheckbox = false,
    children,
    ...tableProps
  } = props;

  const contextValue: AppTableContextState = {
    useSelectionCheckbox,
  }

  return (
    <table {...tableProps} className={["app-table", tableProps.className].join(' ')}>
      <AppTableContext.Provider value={contextValue}>
        { children }
      </AppTableContext.Provider>
    </table>
  )
}

export default AppTable;