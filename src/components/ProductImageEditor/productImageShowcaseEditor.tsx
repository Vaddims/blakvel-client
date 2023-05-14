import { ChangeEventHandler, MouseEventHandler } from "react";
import ProductImageWrapper from "../ProductImageWrapper";
import ImageAdderLabel from "./ImageAdderLabel";

interface ProductImageShowcaseEditorProps {
  thumbnailSrc?: string | null;
  imageSelectionQuantity: number;
  downloadableThumbFilenames: string[];
  uploadedThumbBlobEntries: [string, string][];
  addableImageQuantity: number;
  selections: string[];
  onThumbnailClick?: MouseEventHandler<HTMLDivElement>;
  onThumbnailChange?: ChangeEventHandler<HTMLInputElement>;
  onDownloadableThumbClick?: (element: string) => MouseEventHandler<HTMLDivElement>;
  onUploadedThumbClick?: (element: string) => MouseEventHandler<HTMLDivElement>;
  onThumbAddChange?: ChangeEventHandler<HTMLInputElement>;
  onImageRemove?: () => void;
  elementIsSelected: (element: string) => boolean;
}

const ProductImageShowcaseEditor: React.FC<ProductImageShowcaseEditorProps> = (props) => {
  const { 
    thumbnailSrc, 
    imageSelectionQuantity, 
    downloadableThumbFilenames,
    uploadedThumbBlobEntries,
    addableImageQuantity,
    onThumbnailClick,
    onThumbnailChange,
    onDownloadableThumbClick,
    onUploadedThumbClick,
    onThumbAddChange,
    onImageRemove,
    elementIsSelected,
  } = props;

  const renderProductPreview = () => {
    if (thumbnailSrc) {
      return (
        <img src={thumbnailSrc} alt="" className="selected-product-preview" />
      );
    }

    return (
      <h1 className="media-undisplayable-title">{imageSelectionQuantity} images selected</h1>
    );
  }

  const renderThumbnailManager = () => {
    if (thumbnailSrc) {
      return (
        <ProductImageWrapper
          className={`media-preview `}
          src={thumbnailSrc}
          alt='Thumbnail'
          onClick={onThumbnailClick}
        />
      );
    }

    return (
      <ImageAdderLabel
        onChange={onThumbnailChange}
      />
    );
  }

  const singleSelectionManager = (
    <button className="selected-media-action" onClick={onImageRemove}>Remove Image</button>
  );

  const multipleSelectionManager = (
    <button className="selected-media-action" onClick={onImageRemove}>Remove {imageSelectionQuantity} Images</button>
  );

  const elementClassName = (element: string) => {
    return `media-preview ${elementIsSelected(element) ? 'selected' : ''}`;
  }

  return (
    <div className="product-image-showcase-inspector">
      <div className="selected-product-image-wrapper">
        {renderProductPreview()}
      </div>
      <div className="image-showcase">
        {renderThumbnailManager()}
        <hr className="showcase-divider" />
        {downloadableThumbFilenames.map((filename) => (
          <ProductImageWrapper
            className={`media-preview ${elementClassName(filename)}`}
            src={`/api/media/${filename}`}
            onClick={onDownloadableThumbClick?.(filename)}
            alt={filename}
            key={filename}
          />
        ))}
        {uploadedThumbBlobEntries.map(([filename, src]) => (
          <ProductImageWrapper 
            className={`media-preview ${elementClassName(filename)} `}
            onClick={onUploadedThumbClick?.(filename)}
            src={src}
            alt={filename}
            key={filename}
          />
        ))}
        {addableImageQuantity > 0 && (
          <ImageAdderLabel 
            onChange={onThumbAddChange}
            multiple 
          />
        )}
      </div>
      <div className="media-management">
        <div className="selected-media-management">
          {imageSelectionQuantity > 0 && (
            imageSelectionQuantity === 1 ? singleSelectionManager : multipleSelectionManager
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductImageShowcaseEditor;