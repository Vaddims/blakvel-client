import Header from './header';
import Navbar, { NavbarPhase } from '../../components/navbar';
import CatalogPreview from './catalog-preview';
import './landing.scss'

function LandingPage() {
  return (
    <div id='landing' className='landing-page'>
      <Navbar phase={NavbarPhase.hybrid} />
      <Header />
      <CatalogPreview />
    </div>
  )
}

export default LandingPage;