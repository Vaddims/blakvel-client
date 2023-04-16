import { useState } from "react"
import { CheckboxField } from "../../components/CheckboxField";

interface CheckboxFieldManagementProps {
  readonly label?: string;
  readonly initialyChecked?: boolean;
  readonly onChange?: (checked: boolean) => void;
}

export const useCheckboxFieldManagement = (options?: CheckboxFieldManagementProps) => {
  const {
    label,
    initialyChecked = false,
    onChange,
  } = options ?? {};

  const [ checked, setChecked ] = useState(initialyChecked);
  const [ anchor, setAnchor ] = useState(initialyChecked);

  const update = (check: boolean, isAnchor = false) => {
    if (isAnchor) {
      setAnchor(check);
    }

    setChecked(check);
  }

  const toggle = () => {
    setChecked(!checked);
  }

  const restoreInput = () => {
    setChecked(anchor);
  }

  const handleCheckboxClick: React.MouseEventHandler<HTMLButtonElement> = () => {
    toggle();
    onChange?.(!checked);
  }

  const render = () => (
    <CheckboxField
      label={label}
      checked={checked}
      onClick={handleCheckboxClick}
    />
  );
  
  return {
    update,
    toggle,
    setAnchor,
    restoreInput,
    checked,
    render,
  }
}