import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputFieldDatalistElement } from "../../components/TextInputField";
import { useGetUsersQuery } from "../../services/api/coreApi";
import { InputField, InputFieldError } from "./input-field-hook";
import useTextInputField, { TextInputFieldHook } from "./text-input-field-hook"
import { UserDto } from "../../dto/user/user.dto";

interface UserSearchInputFieldOptions extends InputField.GetHookParameters<TextInputFieldHook<UserDto>> {
  readonly datalistUserIdMask?: string[]
}

const useUserSearchInputField = (options: UserSearchInputFieldOptions) => {
  const { data: fetchedUsers = [], isError, isLoading } = useGetUsersQuery();
  const { datalistUserIdMask = [] } = options;
  
  const userDatalist: InputFieldDatalistElement[] = (
    fetchedUsers
  ).filter(
    user => !datalistUserIdMask.includes(user.id)
  ).map(fetchedUser => ({
    name: fetchedUser.email,
    description:`${fetchedUser.fullname.last} ${fetchedUser.fullname.first}`,
  }))

  const inputField = useTextInputField({
    placeholder: 'Search User',
    inputIcon: faSearch,
    validationTimings: [InputField.ValidationTiming.Submit],
    ...options,
    submitActions: {
      blurInput: true,
      ...options.submitActions
    },
    datalist: userDatalist,
    disabled: isError || isLoading,
    validate(input) {
      const firstStageValidatedInput = options.validate ? options.validate(input).id : input;
      
      const targetUser = fetchedUsers.find(user => (
        user.email === firstStageValidatedInput ||
        user.id === firstStageValidatedInput
      ));

      if (!targetUser) {
        throw new InputFieldError(`Input didn't match with any user data (id, email)`);
      }

      return targetUser;
    }
  });

  return inputField;
}

export default useUserSearchInputField;