import { NavbarMode } from '../../layouts/Navbar';
import LandingHeader from './landing-header';
import Page from '../../layouts/Page';
import './landing.scss';
import WhyBlakvel from './why-blakvel';
import TheTradeProcess from './the-trade-process';
import ExploreConfidently from './explore-confidently';
import TeamAndContact from './team-and-contact';

export default function Landing() {
  return (
    <Page id='landing' navbarMode={NavbarMode.dynamicBlend}>
      <LandingHeader />
      <WhyBlakvel />
      <TheTradeProcess />
      <ExploreConfidently />
      <TeamAndContact />
    </Page>
  );
}
