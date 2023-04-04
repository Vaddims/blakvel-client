import { useState } from "react"
import { CheckboxField } from "../../components/CheckboxField";

export const useCheckboxFieldManagement = () => {
  const [ checked, setChecked ] = useState(false);
  const [ anchor, setAnchor ] = useState(false);

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
  }

  const render = () => (
    <CheckboxField
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