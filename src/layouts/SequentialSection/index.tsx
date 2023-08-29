import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './sequential-section.scss';
import { IconDefinition, faBridge } from '@fortawesome/free-solid-svg-icons';

interface SequentialSectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  title: string;
  icon?: IconDefinition;
  description?: string;
}

const SequentialSection: React.FC<SequentialSectionProps> = (props) => {
  const {
    title,
    ...sectionProps
  } = props;

  const sectionClassnames = ["sequential-section", sectionProps.className].join(' ');

  return (
    <section {...sectionProps} className={sectionClassnames}>
      <header>
        {props.icon && (<FontAwesomeIcon className='icon' icon={props.icon} />)}
        <h3 className="title">{props.title}</h3>
        <span className='description'>{props.description}</span>
      </header>
      <main>
        {props.children}
      </main>
    </section>
  )
}

export default SequentialSection;