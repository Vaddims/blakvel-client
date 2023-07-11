import { useNavigate } from 'react-router-dom';
import HeaderImage from './header-image.jpg';
import './header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const navigate = useNavigate();

  return (
    <header id='header' className='landing-header'>
      <div className='composition-container'>
        <img src={HeaderImage} alt="Clothes" className='header-image' />
        <div className='maskblur' />
        <div className='gradient' />
      </div>
      <div className='content'>
        <div className='s'>
          <h1 className='main-text'>Cyprus' first online clothing thrift store.</h1>
          <p className='sub-header-text'>Rediscover Fashion with Purpose, Sustainability, and Affordability.</p>
          <div className="actions">
            <button 
              className="store" 
              onClick={() => navigate('/products')}
            >
              Explore Catalog
            </button>
            <button
              className='request-review'
              onClick={() => navigate('/item-sale-process')}
            >
              Sell your Item
            </button>
          </div>
        </div>
      </div>
      <div className='scroll-down-icons-wrapper'>
        <FontAwesomeIcon icon={faChevronDown} size={'2x'} />
        <FontAwesomeIcon icon={faChevronDown} size={'2x'} />
        <FontAwesomeIcon icon={faChevronDown} size={'2x'} />
      </div>
      {/* <div className='image-gradiant-layer' /> */}
    </header>
  )
}

export default Header;