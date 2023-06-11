import LeftLamp from './left-lamp.png';
import RightLamps from './lamp-right.png';
import './explore-confidenlty.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeCompare, faMaximize, faMoneyBillTransfer, faNewspaper, faRotateLeft, faSearch } from '@fortawesome/free-solid-svg-icons';

const ExploreConfidently: React.FC = (props) => {
  return (
    <section className='explore-confidenlty-section'>
      <div className='section-header'>
        <div className='back-face'>
        </div>
        <div className='middle-face'>
          <img src={RightLamps} alt="" />
        </div>
        <div className='front-face'>
        <h1 className='composition-title explore-text'>Explore&nbsp;</h1>
          <img src={LeftLamp} alt="" />
          <h1 className='composition-title confidently-text'>Confidently&nbsp;</h1>
        </div>
      </div>
      <div className='content'>
        <div className="c">
          <div className='content-box'>
            <div className='left composition-content' />
            <div className='right composition-content' />
            <div className='composition-icon-container'>
              <FontAwesomeIcon icon={faMoneyBillTransfer} size='xl' />
            </div>
            <div className='ac'>
              <h1>Pricing Ranges</h1>
              <p>Blakvel offers a wide range of pricing options, ensuring there's something for every fashion lover's budget. Explore our collections to find stylish pieces that suit your preferences and price point.</p>
            </div>
          </div>
          <div className='content-box'>
            <div className='left composition-content' />
            <div className='right composition-content' />
            <div className='composition-icon-container'>
              <FontAwesomeIcon icon={faRotateLeft} size='xl' />
            </div>
            <div className='ac'>
              <h1>Hassle-Free Returns</h1>
              <p>We want you to be completely satisfied with your Blakvel purchase. That's why we offer hassle-free returns within 30 days. If the garment doesn't meet your expectations, you can return it for a full refund or exchange.</p>
            </div>
          </div>
          <div className='content-box'>
            <div className='left composition-content' />
            <div className='right composition-content' />
            <div className='composition-icon-container'>
              <FontAwesomeIcon icon={faMaximize} size='xl' />
            </div>
            <div className='ac'>
              <h1>Size Guide</h1>
              <p>Finding the perfect fit is crucial for a comfortable and flattering look. Consult our detailed size guide to ensure your Blakvel clothes fit you impeccably. We provide measurements and tips to help you select the right size for each item.</p>
            </div>
          </div>
          <div className='content-box'>
            <div className='left composition-content' />
            <div className='right composition-content' />
            <div className='composition-icon-container'>
              <FontAwesomeIcon icon={faNewspaper} size='xl' />
            </div>
            <div className='ac'>
              <h1>New Arrivals</h1>
              <p>Stay on top of the latest fashion trends with Blakvel's New Arrivals. Be the first to explore our fresh collections, featuring the hottest styles and designs. Shop now to secure your favorite pieces before they sell out.</p>
            </div>
          </div>
          <div className='content-box'>
            <div className='left composition-content' />
            <div className='right composition-content' />
            <div className='composition-icon-container'>
              <FontAwesomeIcon icon={faCodeCompare} size='xl' />
            </div>
            <div className='ac'>
              <h1>Compare Specifications</h1>
              <p>At Blakvel, we understand that choosing the right clothing involves attention to detail. That's why we provide a convenient way to compare the specifications of our garments. Easily compare factors such as fabric composition, care instructions, and unique design features to make informed decisions and find the perfect pieces for your wardrobe.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ExploreConfidently;