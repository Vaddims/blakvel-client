import { useLocation, useNavigate } from "react-router-dom";
import Panel, { PanelProps } from "../Panel";
import rawAdminPanelSelectorOptions from './admin-panel-radio-options.json';
import useElementSelectorComponent, { ElementSelectorOptions } from "../../middleware/component-hooks/element-selector-component/useElementSelectorComponent";
import ElementSelectorButtonOptions from "../../components/ElementSelectorOption/element-selector-options.interface";

interface AdminPanelRadioButtonOptionPayload {
  readonly endpoint: string;
}

type TypedElementSelectorOptions = ElementSelectorOptions<AdminPanelRadioButtonOptionPayload>;
const adminPanelSelectorOptions: TypedElementSelectorOptions = rawAdminPanelSelectorOptions;

const AdminPanel: React.FC<PanelProps> = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { pathname } = location;
  const endpoint = pathname.split('/admin-panel')[1].replaceAll('/', '');
  const target = adminPanelSelectorOptions.buttonOptions!.find(option => option.payload.endpoint.replace('/', '') === endpoint);

  const onTargetChange = (radioButtonOptions: ElementSelectorButtonOptions<AdminPanelRadioButtonOptionPayload>) => {
    const endpoint = radioButtonOptions.payload?.endpoint ?? "";
    navigate(`/admin-panel${endpoint}`);
  }

  const a = useElementSelectorComponent({
    ...adminPanelSelectorOptions,
    initialTarget: target,
    onSelectionChange: onTargetChange,
  });

  const extensions = [
    a.render(),
    props.extensions,
  ];

  return (
    <Panel {...props} extensions={extensions} />
  );
}

export default AdminPanel;