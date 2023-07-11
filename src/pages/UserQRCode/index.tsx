import { useQRCode } from "next-qrcode";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import './user-qr-code.scss';
import { ReactComponent as Logo } from './blakvel_emblem.svg';
import { Navigate } from "react-router-dom";

const UserQRCode: React.FC = () => {
  const { user } = useAuthentication();
  const { Image } = useQRCode();

  if (!user) {
    return <Navigate to={`/auth/login`} />
  }

  return (
    <Page>
      <Panel title='Your Unique Account QR Code' displayBackNavigation>
        <div className="qr-code-container">
          <div className="image-container">
            <Image
              text={`http://192.168.0.4:3001/users/${user.id}/inspect`}
              options={{
                // scale: 0.5,
                width: window.innerWidth,
                margin: 0,
                color: {
                  dark: '#1E1E1E',
                  light: '#ffffff',
                },
              }}
            />
            <div className="logo-container">
            <Logo className="logo" />
            </div>
          </div>
          <div className="info">
            <p>This QR code is your personal account QR code, uniquely generated for you. It serves as a convenient link to your user account, providing easy access to your account information.</p>
            <hr />
            <p>By showing this QR code to our staff at our Drop Point, they will be able to identify your account and record your items accurately. This QR code is a crucial part of our transparent process, allowing us to provide you with updates on the evaluation and placement of your items.</p>
            <hr />
            <p>It ensures the seamless transaction and privacy of your information. Rest assured, only authorized staff members will have access to your user account to perform necessary tasks related to the evaluation and processing of your items.</p>
            <hr />
            <p>Thank you for choosing Blakvel!</p>
          </div>
        </div>
      </Panel>
    </Page>
  );
}

export default UserQRCode;