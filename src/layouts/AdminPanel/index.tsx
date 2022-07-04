import { useLocation, useNavigate } from "react-router-dom";
import { RadioButtonOptions } from "../../components/RadioButton/radio-button-options.interface";
import RadioSelector, { RadioSelectorOptions } from "../../components/RadioSelector";
import Panel, { PanelProps } from "../Panel";
import rawAdminPanelSelectorOptions from './admin-panel-radio-options.json';

type TypedRadioSelectorOptions = RadioSelectorOptions<AdminPanelRadioButtonOptionPayload>;

const adminPanelSelectorOptions = rawAdminPanelSelectorOptions as 
  & Required<Pick<TypedRadioSelectorOptions, 'buttonOptions'>>
  & TypedRadioSelectorOptions;

interface AdminPanelRadioButtonOptionPayload {
  readonly endpoint: string;
}

const AdminPanel: React.FC<PanelProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;
  const endpoint = pathname.split('/admin-panel')[1].replaceAll('/', '');
  const target = adminPanelSelectorOptions.buttonOptions.find(option => option.payload.endpoint.replace('/', '') === endpoint);

  const onTargetChange = (radioButtonOptions: RadioButtonOptions<AdminPanelRadioButtonOptionPayload>) => {
    const endpoint = radioButtonOptions.payload?.endpoint ?? "";
    navigate(`/admin-panel${endpoint}`);
  }

  const extensions = (
    <>
      <RadioSelector<AdminPanelRadioButtonOptionPayload> 
        {...adminPanelSelectorOptions} 
        initialTarget={target} 
        onSelectionChange={onTargetChange} 
      />
      {props.extensions}
    </>
  );

  return (
    <Panel {...props} extensions={extensions} />
  );
}

export default AdminPanel;