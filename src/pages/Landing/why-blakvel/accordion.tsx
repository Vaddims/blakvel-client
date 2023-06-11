import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HTMLProps, useEffect, useRef, useState } from "react";

interface AccordionProps extends HTMLProps<HTMLElement> {
  readonly label: string;
  readonly text: string;
  readonly show: boolean;
  readonly icon: IconDefinition;
}

const Accordion: React.FC<AccordionProps> = (props) => {
  const {
    label,
    text,
    show,
    icon,
    ...sectionProps
  } = props;

  const accordionContentRef = useRef<HTMLDivElement>(null);
  const [ haveBeenInitiated, setInitState ] = useState(false);

  useEffect(() => {
    const accordionContent = accordionContentRef.current;

    if (!accordionContent) {
      return;
    }

    if (!haveBeenInitiated && show) {
      accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      setInitState(true);
    }

    if (haveBeenInitiated) {
      if (!show) {
        accordionContent.style.maxHeight = '';
      } else {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
      }
    }
  });
  
  return (
    <section {...sectionProps} className="accordion" aria-selected={show}>
      <header>
        <div className="icon-wrapper">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="label">{label}</h3>
      </header>
      <div className="content" ref={accordionContentRef}>
        <p>{text}</p>
      </div>
    </section>
  )
}

export default Accordion;