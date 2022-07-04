import CatImage from './cat.jpg';
import './header.scss'

function Header() {
  return (
    <header id='header' className='landing-header'>
      <img src={CatImage} alt="Cat" />
      <div className='image-gradiant-layer' />
    </header>
  )
}

export default Header;