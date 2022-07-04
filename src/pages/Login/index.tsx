import { ChangeEvent, useState, ChangeEventHandler, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { User } from '../../models/user.model';
import Page from "../../layouts/Page";
import './login.scss';
import { useLoginMutation } from "../../services/api/usersApi";
import { useAppDispatch } from "../../middleware/hooks/reduxAppHooks";
import { setUser } from "../../services/slices/userSlice";

interface LoginPageState {
  emailField: string;
  passwordField: string;
  rememberUser: boolean;
}

export default function Login() {
  const navigate = useNavigate();
  const [ login ] = useLoginMutation();
  const dispatch = useAppDispatch();

  const [state, setState] = useState<LoginPageState>({
    emailField: 'vadym.iefremov@gmail.com',
    passwordField: 'pass',
    rememberUser: false,
  });

  const setFieldValue = (field: keyof LoginPageState) => (event: ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      [field]: event.target.value,
    })
  }

  const toggleRememberUserCheckbox: ChangeEventHandler<HTMLInputElement> = () => {
    setState({
      ...state,
      rememberUser: !state.rememberUser,
    })
  }

  const submitLogin: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    try {
      await login({
        email: state.emailField,
        password: state.passwordField,
        remember: state.rememberUser,
      });

      const userResponse = await fetch('/api/users/current');
      if (!userResponse.ok) {
        return;
      }
      
      const user = await userResponse.json() as User;
      dispatch(setUser(user));
      localStorage.setItem('REFRESH_TOKEN_START', new Date().getTime().toString());
      navigate('/');
    } catch {
      console.log('no');
    }
  }
  
  return (
    <Page id='login'>
      <main>
        <div className="login-box">
          <form id="login-form" onSubmit={submitLogin}>
            <label className="login-input-label" htmlFor="login-email-input">
              <div className="icon-boundary">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="login-input-box">
                <input 
                  className="login-input" 
                  id="login-email-input" 
                  type="email" 
                  placeholder="Email"
                  onChange={setFieldValue('emailField')}
                  value={state.emailField}
                  required
                />
              </div>
            </label>
            <label className="login-input-label" htmlFor="login-password-input">
              <div className="icon-boundary">
                <i className="fas fa-key"></i>              
              </div>
              <div className="login-input-box">
                <input 
                  className="login-input" 
                  type="password" 
                  id="login-password-input" 
                  placeholder="Password" 
                  onChange={setFieldValue('passwordField')}
                  value={state.passwordField}
                  required 
                />
              </div>
            </label>
            <label className="remember-user-radio-box" htmlFor="remember-user-radio">
              <span className="remember-user-title">Remember Me</span>
              <input type="checkbox" name="" id="remember-user-radio" onChange={toggleRememberUserCheckbox} checked={state.rememberUser} />
            </label>
            <input className="login-submit-button" type="submit" value="Login" />
          </form>
        </div>
      </main>
    </Page>
  )
}