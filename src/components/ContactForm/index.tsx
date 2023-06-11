import useSelectInputField, { defaultSelectInputFieldOption } from "../../middleware/hooks/select-input-field-hook";
import useTextInputField from "../../middleware/hooks/text-input-field-hook";
import contactTypeOptions from './contact-type.options.json';
import './contact-form.scss';
import useTextareaInputField from "../../middleware/hooks/textarea-input-field-hook";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";

export enum ContactFormType {
  Review = 'review',
  Support = 'support',
  Question = 'question',
}

interface ContactFormProps {
  readonly defaultFormType?: ContactFormType;
  readonly formTypeChangable?: boolean;
  readonly allowedFormTypes?: ContactFormType[];
}

const ContactForm: React.FC<ContactFormProps> = (props) => {
  const { user } = useAuthentication();

  const typeInput = useSelectInputField({
    label: 'Motive',
    required: true,
    options: !props.allowedFormTypes ? contactTypeOptions : contactTypeOptions.filter(o => props.allowedFormTypes?.includes(o.value as ContactFormType)),
    value: contactTypeOptions.find(option => option.value === props.defaultFormType),
    className: 'contact-type'
  });

  // Change
  const a = /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  const name = user?.email ? user.email.match(a)![1] : '';
  const fullnameInput = useTextInputField({
    label: 'Full name',
    required: true,
    value: name,
    trackValue: true,
    className: 'contact-fullname'
  })

  const emailInput = useTextInputField({
    label: 'Email',
    required: true,
    value: user?.email,
    trackValue: true,
    disabled: !!user,
    helperText: 'We will respond to the provided email.',
    className: 'contact-email'
  });

  const messageInput = useTextareaInputField({
    label: 'Message',
    required: true,
    className: 'contact-message'
  });

  const renderContactSpecification = () => {
    switch(typeInput.value.value) {
      case ContactFormType.Question:
        return (
          <>
            {/* {messageInput.render()} */}
          </>
        );

      case ContactFormType.Review:
        return (
          <>
            {/* {messageInput.render()} */}
          </>
        )

      case ContactFormType.Support:
        return (
          <>
            {/* {messageInput.render()} */}
          </>
        )

      default:
        return (
          <></>
        )
    }
  }

  return (
    <div className='contact-form'>
      {!user && emailInput.render()}
      {!user && fullnameInput.render()}
      {typeInput.render()}
      {messageInput.render()}
      {renderContactSpecification()}
      {/* { typeInput.value.value !== defaultSelectInputFieldOption.value && (
        <button className="submit-button">Submit</button>
      )} */}
    </div>
  )
}

export default ContactForm;