import { ChangeEvent, useState, ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { User } from '../../models/user.model';
import Page from "../../layouts/Page";
import './login.scss';
import { useLoginMutation, usersApi } from "../../services/api/usersApi";
import { useAppDispatch } from "../../middleware/hooks/reduxAppHooks";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { AuthStatus, setAuthStatus } from "../../services/slices/authSlice";
import { composedValueAbordSymbol, useInputFieldManagement } from "../../middleware/hooks/useInputFieldManagement";
import { useCheckboxFieldManagement } from "../../middleware/hooks/useCheckboxFieldManagement";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";

interface LoginPageState {
  emailField: string;
  passwordField: string;
  rememberUser: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const [ login ] = useLoginMutation();
  const dispatch = useAppDispatch();
  const { refetchUser } = useAuthentication();

  const emailInputField = useInputFieldManagement<string>({
    label: 'Email',
    required: true,
    inputIcon: faEnvelope,
    type: 'email',
    initialInputValue: 'vadym.iefremov@gmail.com',
    format(input) {
      return input;
    },
  })

  const passwordInputField = useInputFieldManagement<string>({
    label: 'Password',
    required: true,
    inputIcon: faKey,
    type: 'password',
    initialInputValue: 'pass',
    format(input) {
      return input
    },
  })

  const rememberUserCheckbox = useCheckboxFieldManagement({
    label: 'Remember me on this device'
  })

  const submitLogin: FormEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    const email = emailInputField.getValidatedInputResult();
    const password = passwordInputField.getValidatedInputResult();

    dispatch(usersApi.util.resetApiState());
    if (email === composedValueAbordSymbol || password === composedValueAbordSymbol) {
      return;
    }

    try {
      await login({
        email: email,
        password: password,
        remember: rememberUserCheckbox.checked,
      }).unwrap();

      dispatch(setAuthStatus(AuthStatus.LoggedIn));
      refetchUser();
      navigate('/');
    } catch {
      console.log('no');
    }
  }
  
  return (
    <Page id='login'>
      <main>
        <div className="login-box">
          { emailInputField.render() }
          { passwordInputField.render() }
          { rememberUserCheckbox.render() }
          <button className="login-submit-button" onClick={submitLogin}>Login</button>
        </div>
      </main>
    </Page>
  )
}