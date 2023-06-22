import { ChangeEvent, useState, ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { User } from '../../models/user.model';
import Page from "../../layouts/Page";
import './login.scss';
import { useLoginMutation, usersApi } from "../../services/api/usersApi";
import { useAppDispatch } from "../../middleware/hooks/reduxAppHooks";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { AuthStatus, setAuthStatus } from "../../services/slices/authSlice";
import useCheckboxField from "../../middleware/hooks/checkbox-field-hook";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";

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

  const emailInput = useTextInputField({
    label: 'Email',
    required: true,
    inputIcon: faEnvelope,
    type: 'email',
    value: 'vadym.iefremov@gmail.com',
  })

  const passwordInput = useTextInputField({
    label: 'Password',
    required: true,
    inputIcon: faKey,
    type: 'password',
    value: 'pass',
  })

  const rememberUserCheckbox = useCheckboxField({
    label: 'Remember me on this device'
  })

  const submitLogin: FormEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    const emailResult = emailInput.validate();
    const passwordResult = passwordInput.validate();

    dispatch(usersApi.util.resetApiState());
    if (!emailResult.isValid || emailResult.isForMixedValues || !passwordResult.isValid || passwordResult.isForMixedValues) {
      return;
    }

    try {
      await login({
        email: emailResult.data,
        password: passwordResult.data,
        remember: rememberUserCheckbox.value,
      }).unwrap();

      dispatch(setAuthStatus(AuthStatus.LoggedIn));
      refetchUser();
      navigate('/');
    } catch {
      alert('Auth info is invalid');
    }
  }
  
  return (
    <Page id='login'>
      <main>
        <div className="login-box">
          { emailInput.render() }
          { passwordInput.render() }
          { rememberUserCheckbox.render() }
          <button className="login-submit-button" onClick={submitLogin}>Login</button>
        </div>
      </main>
    </Page>
  )
}