import { faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import './avatar-displayer.scss';

interface AvatarDisplayerProps {
  src?: string | null;
  className?: string;
  noUserIconSize?: SizeProp;
}

const AvatarDisplayer: React.FC<AvatarDisplayerProps> = (props) => {
  const { src, noUserIconSize, className } = props;

  const composedClassNames = [`avatar-wrapper user-appearance`, className].join(' ');
  return (
    <div className={composedClassNames} data-offline-icon={!src}>
      { src ? (
        <img src={src} alt="" />
      ) : (
        <div>
          <FontAwesomeIcon icon={faUser} size={noUserIconSize ?? '1x'} /* size='6x' */ />
        </div>
      ) }
    </div>
  )
}

export default AvatarDisplayer;