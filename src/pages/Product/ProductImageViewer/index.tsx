import ProductImageWrapper from "../../../components/ProductImageWrapper";
import { useFlatElementSelection } from "../../../middleware/hooks/useFlatElementSelection";
import "./productImageViewer.scss";

export interface ProductImageShowcaseProps {
  imageFilenames: string[];
  targetImageFilenames: string[];
}

export function ProductImageShowcase(props: ProductImageShowcaseProps) {
  const { imageFilenames, targetImageFilenames } = props;
  const {
    selections,
    elementIsSelected,
    selectOneElement,
  } = useFlatElementSelection(imageFilenames, {
    targets: targetImageFilenames,
  });

  return (
    <div className="product-image-viewer">
      <div className="element-viewer">
        <ProductImageWrapper src={`/api/media/${selections[0]}`} alt="" />
      </div>
      <div className="media-showcase">
        {imageFilenames.map((imageFilename) => (
          <ProductImageWrapper
            className={elementIsSelected(imageFilename) ? 'selected' : ''}
            onClick={() => selectOneElement(imageFilename)}
            alt={imageFilename}
            src={`/api/media/${imageFilename}`}
            key={imageFilename}
            loading="lazy"
          />
        ))}
      </div>
    </div>
  )
}