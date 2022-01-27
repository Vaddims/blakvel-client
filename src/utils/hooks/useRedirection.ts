import { MouseEvent } from 'react';
import { useNavigate, To, NavigateOptions } from "react-router-dom";

export function useRedirection() {
  const navigate = useNavigate();

  return function redirect(to: To, options?: NavigateOptions) {
    return function (event: MouseEvent<Element>) {
      event.preventDefault();
      navigate(to, options);
    }
  }
}