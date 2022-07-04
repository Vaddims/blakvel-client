import { NavbarMode } from '../../layouts/Navbar';
import LandingHeader from './landing-header';
import Page from '../../layouts/Page';
import './landing.scss';

export default function Landing() {
  return (
    <Page id='landing' navbarMode={NavbarMode.hybrid}>
      <LandingHeader />
    </Page>
  );
}
