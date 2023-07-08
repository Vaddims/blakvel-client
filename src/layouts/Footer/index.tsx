import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as Logo} from './blakvel_emblem.svg';
import './footer.scss';
import { faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import ContactForm, { ContactFormType } from '../../components/ContactForm';
import useTextInputField from '../../middleware/hooks/text-input-field-hook';

export default function Footer() {
  return (
    <div className="footer">
      <div className='info-grid'>
        <div className='grid-item company-container'>
          <div className='company-icon-name-container'>
            <Logo className='logo' width={40} height={40} />
            <h2>Blakvel</h2>
          </div>
          <p>Rediscover Fashion with Purpose, Sustainability, and Affordability.</p>
        </div>
        <div className='grid-item company-about'>
          <h4>Navigation</h4>
          <ul>
            <li><a href="">Products</a></li>
            <li><a href="">Sell Product</a></li>
          </ul>
        </div>
        <div className='grid-item company-terms'>
          <h4>Contact</h4>
          <ul>
            <li><a href="">About Us</a></li>
            <li><a href="">Support</a></li>
          </ul>
        </div>
        <div className='grid-item company-socials'>
          <h4>Get In Touch</h4>
          <p><a href="">blakvel@gmail.com</a></p>
          <div className='social-container'>
            <a>
              <FontAwesomeIcon icon={faInstagram as any} size='2x' />
            </a>
            <a>
              <FontAwesomeIcon icon={faFacebook as any} size='2x' />
            </a>
            <a>
              <FontAwesomeIcon icon={faLinkedin as any} size='2x' />
            </a>
          </div>
        </div>
      </div>
      <div className='overall-info'>
        <p>Blakvel Copyright © { new Date().getFullYear() } · All rights reserved · Created By <a href="">Vaddims</a></p>
      </div>
    </div>
  )
}
