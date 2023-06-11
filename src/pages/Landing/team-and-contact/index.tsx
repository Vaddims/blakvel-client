import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ContactForm, { ContactFormType } from '../../../components/ContactForm';
import Image from './hands.png';
import './team-and-contact.scss';
import { faQuoteLeft, faQuoteRight } from '@fortawesome/free-solid-svg-icons';

const TeamAndContact = () => {
  return (
    <section className='team-and-contact-section'>
      <header className='composition-header'>
        <div className='back-face'>
        </div>
        <div className='image-blend-layer'>
          <img src={Image} alt="" />
          <div className='test'></div>
        </div>
        <div className='front-face'>
          <h1 className='composition-title blakvel-text'>BLAKVEL</h1>
          <h1 className='composition-title team-text'>Team</h1>
        </div>
      </header>
      <div className='content'>
        <div className='about-us'>
          <div className='info-container'>
            <div className='about-us-container'>
              <h1>Our Journey Begins</h1>
              <p>Blakvel is the result of our ambitious journey as a team of highly distinguished students from Latsia Lyceum, who participated in the Junior Achievement Cyprus entrepreneurship competition.</p>
            </div>
            <div className='about-us-container'>
              <h1>Empowering Personal Style</h1>
              <p>Led by Stelios Charalambides, our CEO, we continue to pursue our vision of delivering exceptional fashion that empowers individuals to express their unique style.</p>
            </div>
            <div className='about-us-container'>
              <h1>Craftsmanship and Timeless Designs</h1>
              <p>Our carefully curated collections are a testament to our dedication to craftsmanship, quality, and timeless designs that go beyond trends.</p>
            </div>
            <div className='about-us-container'>
              <h1>Community-Driven Approach</h1>
              <p>At Blakvel, we believe in inclusivity and actively engage with our community to understand and adapt to their needs and preferences.</p>
            </div>
          </div>
          <div className='quote-container'>
            <div className='quote-compisition'>
              <FontAwesomeIcon icon={faQuoteLeft} className='quote-left' size='3x' />
              <FontAwesomeIcon icon={faQuoteRight} className='quote-right' size='3x' />
            </div>
            <p>Stelios Charalambides - CEO</p>
            <h1>
              {/* <FontAwesomeIcon icon={faQuoteRight} className='quote-right' size='2x' /> */}
              Our goal is to create a unique, marketable, and helpful tool for the Cypriot community, with social work as our highest priority.
            </h1>
          </div>
        </div>
        <div className='contact-us'>
          <div className='contact-container'>
            <div className='contact-sector'>
              <h1>Contact Us</h1>
              <p>We would love to hear from you and continue our inspiring journey together. Whether you have a question, feedback, or collaboration opportunities, please don't hesitate to reach out to us.</p>
            </div>
            <div className='contact-sector'>
              <ContactForm
                allowedFormTypes={[ContactFormType.Review, ContactFormType.Question, ContactFormType.Support]}
              />
            </div>
            <div className='contact-sector'>
              <button className='submit-contact-form'>Submit</button>
            </div>
          </div>
        </div>
        {/* <p>We appreciate your support as we strive to redefine fashion and make a positive impact. Join us in celebrating our roots in the Junior Achievement competition and embrace the ambition that drives us forward.</p> */}
      </div>
    </section>
  );
}

export default TeamAndContact;