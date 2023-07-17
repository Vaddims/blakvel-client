import { useParams } from "react-router-dom";
import Page from "../../layouts/Page";
import Panel from "../../layouts/Panel";
import { useRedirection } from "../../utils/hooks/useRedirection";
import { ProductImageShowcase } from "./ProductImageViewer";
import { useGetProductQuery } from "../../services/api/coreApi";
import { useAppSelector } from "../../middleware/hooks/reduxAppHooks";
// import { selectUser } from "../../services/slices/userSlice";
import "./product.scss";
import { UserRole } from "../../models/user.model";
import { Product as ProductModel } from "../../models/product.model";
import { useAuthentication } from "../../middleware/hooks/useAuthentication";
import { useUpdateUserMutation } from "../../services/api/coreApi";
// import { useGetAuthenticatedUserQuery } from "../../services/api/coreApi";

const templateDescription = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum necessitatibus, ut hic in non ab adipisci maiores libero doloribus sit debitis quis illum. Beatae facere corporis ratione voluptate voluptates suscipit?';

const formatDiscountExpirationDate = (date: Date) => {
  const formattedDateString = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const formattedTimeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  return `${formattedDateString} ${formattedTimeString}`
}

export default function Product() {
  const { id = '' } = useParams();
  const authentication = useAuthentication();
  const { data: product } = useGetProductQuery(id, { skip: !id });
  const [ updateUser ] = useUpdateUserMutation();
  const { user } = useAuthentication();
  const redirect = useRedirection();

  const allLoaded = !!authentication.user && !!product;
  const productInCart = !!authentication.user && !!product && authentication.user.shoppingCart.some(item => item.product.id === product.id)

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

  const addProductToCart = async () => {
    if (!authentication.user || !product) {
      return;
    }

    if (productInCart) {
      return;
    }

    const newShoppingCart = [
      ...authentication.user.shoppingCart.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })), 
      {
        productId: product.id,
        quantity: 1,
      }
    ]

    try {
      await updateUser({
        userId: authentication.user.id,
        shoppingCart: newShoppingCart,
      })
    } catch {

    }
  }

  const removeProductFromCart = async () => {
    if (!authentication.user || !product) {
      return;
    }

    if (!productInCart) {
      return;
    }

    const filteredItems = authentication.user.shoppingCart.filter(item => item.product.id !== product.id);
    try {
      await updateUser({
        userId: authentication.user.id,
        shoppingCart: filteredItems.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      })
    } catch {

    }
  }

  const adminHeaderTools = (
    <button 
      className="panel-tool outline-highlight" 
      onClick={redirect(`/products?inspect=${id}`)}
    >
      Edit
    </button>
  );

  const commonHeaderTools = [
    (
      !productInCart ? (
        <button className="panel-tool outline-highlight" onClick={addProductToCart}>To cart</button>
      ) : (
        <button className="panel-tool outline-highlight" onClick={removeProductFromCart}>Delete from cart</button>
      )
    ),
    (
      <button className="panel-tool highlight">Buy</button>
    )
  ];

  const headerTools = commonHeaderTools;
  if (user?.role) {
    headerTools.unshift(adminHeaderTools);
  }

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
          {templateDescription && <p className="product-description">{product.description}</p>}
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
                    Offer ends {formatDiscountExpirationDate(new Date(product.discountExpirationDate))}
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