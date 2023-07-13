import './sequential-section.scss';

interface SequentialSectionProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> {
  title: string;
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
        <h3 className="title">{props.title}</h3>
      </header>
      <main>
        {props.children}
      </main>
    </section>
  )
}

export default SequentialSection;