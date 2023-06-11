import { IconDefinition, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface CarouselItemProps {
  readonly icon: IconDefinition;
  readonly label: string;
  readonly text: string;
}

const CarouselItem: React.FC<CarouselItemProps> = (props) => {
  return (
    <div className="carousel-item">
      <div className="info-container">
        <div className="title-box">
          <h1 className="title"><FontAwesomeIcon className="icon" icon={props.icon} /></h1>
          {props.label}
        </div>
        <p className="carousel-content">{props.text}</p>
      </div>
    </div>
  )
}

export default CarouselItem;