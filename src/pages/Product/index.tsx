import { useParams } from "react-router-dom";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useRedirection } from "../../utils/hooks/useRedirection";
import { ProductImageShowcase } from "./ProductImageViewer";
import { useGetProductQuery } from "../../services/api/productsApi";
import { useAppSelector } from "../../middleware/hooks/reduxAppHooks";
// import { selectUser } from "../../services/slices/userSlice";
import "./product.scss";
import { UserRole } from "../../models/user.model";
import { Product as ProductModel } from "../../models/product.model";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
// import { useGetAuthenticatedUserQuery } from "../../services/api/usersApi";

const templateDescription = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus, ut hic in non ab adipisci maiores libero doloribus sit debitis quis illum. Beatae facere corporis ratione voluptate voluptates suscipit?';
const now = new Date();
const date = now.toLocaleDateString('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const time = now.toLocaleTimeString('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
});
// merge to locale time and to locale date to show the date and time
const dateTime = `${date} ${time}`;


export default function Product() {
  const { id = '' } = useParams();
  const { data: product } = useGetProductQuery(id, { skip: !id });
  // const { data: user } = useGetAuthenticatedUserQuery();
  const { user } = useAuthentication();
  // const user = useAppSelector(selectUser);
  const redirect = useRedirection();

  const imageFilenames: string[] = []; 
  const initialTargets: string[] = [];
  if (product) {
    const { thumbnail, thumbs } = product.urn;
    if (thumbnail) {
      imageFilenames.push(thumbnail);
      initialTargets.push(thumbnail);
    }

    imageFilenames.push(...thumbs);
  }
  
  if (!product) {
    return <h1>NO PRODUCT WITH SUCH ID</h1>
  }

  const adminHeaderTools = (
    <button 
      className="panel-tool outline-highlight" 
      onClick={redirect(`/products/${id}/inspect`)}
    >
      Edit
    </button>
  );

  const commonHeaderTools = (
    <>
      <button className="panel-tool outline-highlight">To card</button>
      <button className="panel-tool highlight">Buy</button>
    </>
  );

  const headerTools = user?.role === UserRole.Admin ? adminHeaderTools : commonHeaderTools;

  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? (100 - Math.round(product.discountPrice! / product.price * 100)) : 0;
  const currentPrice = hasDiscount ? product.discountPrice : product.price;

  const displaySpecifications = product.tags.reduce((specs, tag) => {
    const newSpecs = [...specs];
    for (const field of tag.fields) {
      const specification = product.specifications.find(specification => specification.field.id === field.id)
      if (specification) {
        newSpecs.push(specification);
      }
    }
    return newSpecs;
  }, [] as ProductModel.Specification[]);

  return (
    <Page id="product">
      <Panel title={product.name} displayBackNavigation headerTools={headerTools}>
        {imageFilenames.length > 0 && (
          <ProductImageShowcase imageFilenames={imageFilenames} targetImageFilenames={initialTargets} />
        )}
        <article className="product-details">
          {templateDescription && <p className="product-description">{templateDescription}</p>}
          <div>
            <h2 className="product-price">${currentPrice}</h2>
            {hasDiscount &&
              <div className="product-sale-details">
                <div className="product-sale-specs">
                  <h3 className='product-source-price'>${product.price}</h3>
                  <div className='product-discount-box'>
                    <h5 className='product-discount'>-{discountPercent}%</h5>
                  </div>
                </div>
                { product.discountExpirationDate && (
                  <p className="product-discount-end">
                    Discount until: <b>{new Date(product.discountExpirationDate).toLocaleString()}</b>
                  </p> 
                )}
              </div>
            }
          </div>
          { displaySpecifications.length > 0 && (
            <div className="speciification-cluster">
              <h2 className="specification-cluster-title">Specifications</h2>
              <table className="specifications">
                <tbody>
                  { displaySpecifications.map((specification) => (
                    <tr className="specification-representer">
                      <td>{specification.field.name}</td>
                      <td>{specification.value}</td>
                      <td>{/* Other field */}</td>
                    </tr>
                  )) }
                </tbody>
              </table>
            </div>
          )}
        </article>
      </Panel>
    </Page>
  )
}