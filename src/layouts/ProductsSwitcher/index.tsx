import useSearchParamState from "../../middleware/hooks/useSearchParamState";
import Catalog from "../../pages/Catalog";
import InspectProduct from "../../pages/InspectProduct";

const ProductsSwitcher: React.FC = () => {
  const {
    paramCluster,
    urlSearchParams,
  } = useSearchParamState();

  if (paramCluster.inspect.all.length > 0) {
    return (
      <InspectProduct />
    );
  }

  return (
    <Catalog />
  )
}

export default ProductsSwitcher;