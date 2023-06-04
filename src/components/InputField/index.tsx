import { faRotateBack, faXmark, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { InputField as InputFieldNamespace } from '../../middleware/hooks/input-field-hook';
import { v4 as createUUID } from 'uuid';
import './input-field.scss';

export type FalsyType = false | null | undefined;

export interface InputFieldCommonProps {
  readonly label?: string;
  readonly labelIcon?: IconDefinition;
  readonly inputIcon?: IconDefinition;
  readonly markAsRequired?: boolean;
  readonly helperText?: string;
  readonly htmlFor?: string;
  readonly status?: InputFieldNamespace.Status;
  readonly onInputRestore?: React.MouseEventHandler<HTMLButtonElement> | FalsyType;
  readonly onInputClear?: React.MouseEventHandler<HTMLButtonElement> | FalsyType;
  readonly onUnbound?: (event: MouseEvent) => void;
  readonly fieldClassName?: string;
}

export interface InputFieldProps extends InputFieldCommonProps {
  readonly inputId?: string;
  readonly className?: string;
}

function hasChildElement(element: Element, targetElement: Element): boolean {
  if (element === targetElement) {
    return true;
  }

  return Array.from(element.children).some((child) => hasChildElement(child, targetElement));
}

export const InputField: React.FC<InputFieldProps> = (props) => {
  const labelRef = useRef(null);
  const [ inputId ] = useState(props.inputId ?? createUUID());
  const composedLabelClassName = ['input-field', props.fieldClassName, props.className].join(' ');

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (labelRef.current && !hasChildElement(labelRef.current, event.target as Element)) {
        props.onUnbound?.(event);
      }
    }

    document.body.addEventListener('mouseup', handler);
    return () => {
      document.body.removeEventListener('mouseup', handler);
    }
  })

  return (
    <label
      htmlFor={inputId}
      className={composedLabelClassName}
      data-status={props.status}
      ref={labelRef}
    >
      {props.label && (
        <header>
          { props.labelIcon && (
            <FontAwesomeIcon icon={props.labelIcon} className='label-icon' />
          )}
          <label>
            <span className='label-title'>{props.label}</span>
            { !props.markAsRequired && (
              <>
                <span className='optional-divider'> - </span>
                <span className='optional-label'>Optional</span>
              </>
            )}
          </label>
        </header>
      )}
      <section className="input-section">
        <div className='input-icon-wrapper'>
          { props.inputIcon && <FontAwesomeIcon icon={props.inputIcon} className='input-icon' /> }
        </div>
        { props.children }
        <div className='input-management-actions'>
          { props.onInputRestore && (
            <button className='action-icon' onClick={props.onInputRestore} title='Restore input'>
              <FontAwesomeIcon icon={faRotateBack} size='lg' />
            </button>
          )}
          { props.onInputClear && (
            <button className='action-icon' onClick={props.onInputClear} title='Clear input'>
              <FontAwesomeIcon icon={faXmark} size='xl' />
            </button>
          )}
        </div>
      </section>
      { props.helperText && (
        <span className='helper-text'>{props.helperText}</span>
      )}
    </label>
  )
}

export default InputField;

export function extractInputFieldProps(props: InputFieldCommonProps & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>): InputFieldCommonProps {
  return {
    label: props.label,
    helperText: props.helperText,
    inputIcon: props.inputIcon,
    labelIcon: props.labelIcon,
    onInputClear: props.onInputClear,
    onInputRestore: props.onInputRestore,
    onUnbound: props.onUnbound,
    markAsRequired: props.markAsRequired,
    status: props.status,
    htmlFor: props.htmlFor,
    fieldClassName: props.fieldClassName,
  }
}