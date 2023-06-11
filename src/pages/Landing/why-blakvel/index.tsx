import * as faIcons from '@fortawesome/free-solid-svg-icons';
import { useElementSelection } from '../../../middleware/hooks/useElementSelection';
import accordionOptions from './accordion-options.json';
import Accordion from './accordion';
import Image from './blackjacketman.png';
import './why-blakvel.scss';

enum AccordionOption {
  Price = 'price',
  Profits = 'profits',
  Charity = 'charity',
}

type Option = {
  icon?: string;
  label: string;
  content: string;
};

const WhyBlakvel: React.FC = () => {
  const elementSelection = useElementSelection<Option>(accordionOptions, {
    targets: [accordionOptions[0]],
    identifier: (option) => option.label,
  });

  const handleClick = (option: Option) => () => {
    elementSelection.toggleOneElement(option);
  }

  return (
    <section className='why-blakvel-section'>
      <div className='composition-wrapper'>
        <div className='back-face'>
          <h1 className='composition-title why-text'>Why&nbsp;</h1>
        </div>
        <div className='middle-face'>
          <img src={Image} alt="" />
        </div>
        <div className='front-face'>
          <h1 className='composition-title blakvel-text'>Blakvel&nbsp;</h1>
          <div className='accordions-section'>
            {accordionOptions.map(option => (
              <Accordion
                icon={(faIcons as any)[option.icon!]}
                label={option.label}
                text={option.content}
                onClick={handleClick(option)}
                show={elementSelection.elementIsSelected(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyBlakvel;