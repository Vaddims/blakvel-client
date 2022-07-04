import { MouseEventHandler } from "react";
import "./productImageWrapper.scss";

export interface ProductImageWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  loading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"];
}

const ProductImageWrapper: React.FC<ProductImageWrapperProps> = (props) => {
  const { src, alt, loading, ...divProps } = props;

  return (
    <div {...divProps} className={`product-image-wrapper ${divProps.className || ''}`} >
      <img src={src} alt={alt} loading={loading} className={`product-image`} />
    </div>
  )
}

export default ProductImageWrapper;