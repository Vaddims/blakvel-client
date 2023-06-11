import Image from './theprocess.png';
import carouselBuyProcess from './carousel-buy-process.json';
import carouselSellProcess from './carousel-sell-process.json';
import CarouselItem from './carousel-item';
import './the-trade-process.scss';
import * as icons from '@fortawesome/free-solid-svg-icons';

const TheTradeProcess = () => {
  return (
    <section className='the-trade-process-section'>
      <div className='section-header'>
        <div className='back-face'>
          <h1 className='composition-title the-text'>The</h1>
        </div>
        <div className='middle-face'>
          <img src={Image} alt="" />
        </div>
        <div className='front-face'>
          <h1 className="composition-title process-text">Process</h1>
        </div>
      </div>
      <div className='content'>
        <div className='guidance buy'>
          <h1 className='carousel-title'>To Buy</h1>
          <div className='carousel'>
            {carouselBuyProcess.steps.map(step => (
              <CarouselItem
                icon={(icons as any)[step.icon]}
                label={step.label}
                text={step.content}
              />
            ))}
          </div>
        </div>
        <div className='guidance sell'>
          <h1 className='carousel-title'>To Sell</h1>
          <div className='carousel'>
            {carouselSellProcess.steps.map(step => (
              <CarouselItem 
                icon={(icons as any)[step.icon]}
                label={step.label}
                text={step.content}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TheTradeProcess;