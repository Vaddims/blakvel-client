import { useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../../services/api/productsApi";
// import InspectProduct from "../InspectProduct";

export function ProductInspectionRouter() {
  const [ searchParams ] = useSearchParams();
  const { data: products = [], isLoading, isError } = useGetProductsQuery(searchParams.toString());

  if (isLoading) {
    return <h1>Loading</h1>
  }

  if (isError) {
    return <h1>Could not load</h1>
  }

  if (products.length > 1) {
    return <h1>Multiple</h1>
  }

  const targetProduct = products[0];
  if (!targetProduct) {
    return <h1>No product targetted</h1>
  }

  // return <InspectProduct product={targetProduct} />
}