import CatImage from './cat.jpg';
import './header.scss'

function Header() {
  return (
    <header id='header'>
      <img src={CatImage} alt="" />
      <div className='image-gradiant-layer' />
    </header>
  )
}

export default Header;