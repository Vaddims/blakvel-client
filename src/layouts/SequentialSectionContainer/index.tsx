import './sequential-section-container.scss';

const SequentialSectionContainer: React.FC = (props) => {
  return (
    <div className="sequential-section-container">
      {props.children}
    </div>
  )
}

export default SequentialSectionContainer;