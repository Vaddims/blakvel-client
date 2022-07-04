import { useState } from "react"

export function usePanelExtensionCollpase(initialCollapsed = false) {
  const [ collapsed, setCollapseState ] = useState(initialCollapsed);

  const toggleCollapse = () => {
    setCollapseState(!collapsed);
  }

  return {
    collapsed,
    setCollapseState,
    toggleCollapse,
  }
}