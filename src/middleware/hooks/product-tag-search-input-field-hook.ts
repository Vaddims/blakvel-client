import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputFieldDatalistElement } from "../../components/TextInputField";
import { Product } from "../../models/product.model";
import { useGetProductTagsQuery } from "../../services/api/coreApi";
import { InputField, InputFieldError } from "./input-field-hook";
import useTextInputField, { TextInputFieldHook } from "./text-input-field-hook";

interface UserSearchInputFieldOptions extends InputField.GetHookParameters<TextInputFieldHook<Product.Tag>> {
  readonly datalistTagIdMask?: string[]; 
}

const useProductTagSearchInputField = (options: UserSearchInputFieldOptions) => {
  const { data: fetchedProductTags = [], isError, isLoading } = useGetProductTagsQuery();
  const { datalistTagIdMask = [] } = options;

  const productTagDatalist: InputFieldDatalistElement[] = (
    fetchedProductTags
  ).filter(productTag => (
    !datalistTagIdMask.includes(productTag.id)
  )).map(fetchedProductTag => ({
    name: fetchedProductTag.name,
    description: `${fetchedProductTag.fields.length} Fields`,
  }))

  const inputField = useTextInputField({
    placeholder: 'Search Product Tag',
    inputIcon: faSearch,
    ...options,
    validationTimings: [InputField.ValidationTiming.Submit],
    disabled: isError || isLoading,
    datalist: productTagDatalist,
    validate(input) {
      if (options.validate) {
        return options.validate(input);
      }

      const targetProductTag = fetchedProductTags.find(fetchedProductTag => (
        fetchedProductTag.name === input ||
        fetchedProductTag.id === input
      ));

      if (!targetProductTag) {
        throw new InputFieldError(`Input didn't match with any product tag data (id, name)`);
      }

      return targetProductTag;
    }
  });

  return inputField;
}

export default useProductTagSearchInputField;