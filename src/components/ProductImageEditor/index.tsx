import { forwardRef, useEffect, useImperativeHandle, useState, ForwardRefRenderFunction } from "react";
import { usePatchProductThumbsMutation, useUpdateThumbnailMutation, useDeleteProductThumbnailMutation } from '../../services/api/productsApi';
import ProductImageWrapper from "../ProductImageWrapper";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { Product } from "../../models/product.model";
import { useNavigate } from "react-router-dom";
import * as uuid from 'uuid';
import * as path from 'path';
import './productImageShowcaseInspector.scss';

export interface ProductImageShowcaseInspectorProps {
  product?: Product;
}

export interface ProductImageShowcaseInspectorRefMethods {
  uploadImages: (id: string) => void;
  deselectAllElements: () => void;
}

type ProductImageShowcaseInspectorComponentType = ForwardRefRenderFunction<
  ProductImageShowcaseInspectorRefMethods, 
  ProductImageShowcaseInspectorProps
>;

const ProductImageShowcaseInspectorComponent: ProductImageShowcaseInspectorComponentType = (props, ref) => {
  const { product } = props;

  const navigate = useNavigate();

  const [ patchThumbs ] = usePatchProductThumbsMutation();
  const [ updateThumbnail ] = useUpdateThumbnailMutation();
  const [ deleteThumbnail ] = useDeleteProductThumbnailMutation();

  const [ localThumbnailFile, setLocalThumbnailFile ] = useState<File>();
  const [ thumbnailSrc, setThumbnailSrc ] = useState<string | null>(
    product?.urn.thumbnail ? `/api/media/${product.urn.thumbnail}` : null
  );
 
  const downloadedProductThumbFilenames = [...product?.urn.thumbs ?? []];
  const [ productThumbFilenames, setProductThumbFilenames ] = useState(downloadedProductThumbFilenames);
  const [ localThumbFiles, setLocalThumbFiles ] = useState<File[]>([]);
  
  const [ localFileBlobMap, setLocalFileBlobMap ] = useState(new Map<string, string>());

  const selectableImageIdentificators = [...productThumbFilenames, ...localFileBlobMap.keys()];
  if (thumbnailSrc) {
    selectableImageIdentificators.unshift(thumbnailSrc);
  }

  const {
    selections,
    elementIsSelected,
    deselectAllSelections,
    handleSelectionEvent,
  } = useSequentialElementSelection(selectableImageIdentificators, {
    dependencies: [localFileBlobMap, thumbnailSrc],
  });

  useEffect(() => {
    setLocalFileBlobMap(((initialFileBlobMap) => {
      if (initialFileBlobMap.size === 0 && localThumbFiles.length === 0) {
        return initialFileBlobMap;
      }

      const localFileBlob = (file: File) => [file.name, URL.createObjectURL(file)] as const;
      const blobMap = new Map<string, string>(localThumbFiles.map(localFileBlob));
      return blobMap;
    }));

    return () => localFileBlobMap.forEach(url => URL.revokeObjectURL(url));
  }, [localThumbFiles]);

  useEffect(() => {
    if (!localThumbnailFile) {
      return;
    }
    
    const url = URL.createObjectURL(localThumbnailFile);
    setThumbnailSrc(url);
    
    return () => URL.revokeObjectURL(url);
  }, [localThumbnailFile]);
  
  useImperativeHandle(ref, () => ({
    deselectAllElements: deselectAllSelections,
    async uploadImages(id: string) {
      const thumbFormData = new FormData();
      const thumbsToRemoveFilenames = product?.urn.thumbs.filter(
        (filename) => !productThumbFilenames.includes(filename)
      ) ?? [];

      for (const filename of thumbsToRemoveFilenames) {
        thumbFormData.append("remove", filename);
      }

      for (const file of localThumbFiles) {
        thumbFormData.append("add", file, file.name);
      }

      await patchThumbs({
        formData: thumbFormData,
        id,
      });

      if (!thumbnailSrc) {
        await deleteThumbnail(id);
      } else if (localThumbnailFile) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append('file', localThumbnailFile, localThumbnailFile.name);
        await updateThumbnail({
          formData: thumbnailFormData,
          id,
        });
      }

      navigate(`/products/${id}`);
    }
  }));

  const removeSelectedImage = () => {
    setLocalThumbFiles(localThumbFiles.filter((file) => !elementIsSelected(file.name)));
    setProductThumbFilenames(productThumbFilenames.filter((imageFilename) => !elementIsSelected(imageFilename)));
    if (thumbnailSrc && selections.includes(thumbnailSrc)) {
      setLocalThumbnailFile(undefined);
      setThumbnailSrc(null);
    }
  }

  const multipleTatgetsManager = (
    <>
      <button className="selected-media-action" onClick={removeSelectedImage}>
        Remove {selections.length} Images
      </button>
    </>
  );

  const singleTargetManager = (
    <>
      <button className="selected-media-action" onClick={removeSelectedImage}>Remove Image</button>
    </>
  );

  const allowedImageQuantity = 8 - productThumbFilenames.length - localThumbFiles.length;
  const onImageLoad: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const imageArray: File[] = [];
    for (const file of event.target.files) {
      const extension = path.extname(file.name);
      const blob = new Blob([file], { type: file.type });
      const newFilename = uuid.v4() + extension;
      const image = new File([blob], newFilename, { type: file.type });
      imageArray.push(image)
    }

    const fileArrayInBoundary = imageArray.slice(0, allowedImageQuantity);
    setLocalThumbFiles([...localThumbFiles, ...fileArrayInBoundary]);
  }

  const onThumbnailLoad: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLocalThumbnailFile(file);
  }

  const firstSelection = selections[0];

  const imageSource = selections.length === 1 ? 
    firstSelection === thumbnailSrc ? 
      thumbnailSrc :
      productThumbFilenames.includes(firstSelection) ?
        `/api/media/${firstSelection}` :
        localFileBlobMap.get(firstSelection) :
      '';

  return (
    <div className="product-image-showcase-inspector">
      <div className="selected-product-image-wrapper">
        {selections.length === 1 ? (
          <img src={imageSource} alt="" className="selected-product-preview" />
        ) : (
          <h1 className="media-undisplayable-title">{selections.length} products selected</h1>
        )}
      </div>
      <div className="image-showcase">
        {thumbnailSrc ? (
          <ProductImageWrapper
            onClick={handleSelectionEvent(thumbnailSrc)}
            className={`media-preview ${elementIsSelected(thumbnailSrc) ? 'selected' : ''}`}
            alt={'Product'}
            src={thumbnailSrc}
          />
        ) : (
          <label className='media-add' about='add-file'>
            <input type="file" id='add-file' onChange={onThumbnailLoad} />
            <h1 className="media-add-icon">+</h1>
          </label>
        )}
        <hr />
        {productThumbFilenames.map((filename) => (
          <ProductImageWrapper
            className={`media-preview ${elementIsSelected(filename) ? 'selected' : ''}`}
            onClick={handleSelectionEvent(filename)}
            alt={filename}
            src={`/api/media/${filename}`}
            key={filename}
          />
        ))}
        {[...localFileBlobMap].map(([filename, src]) => (
          <ProductImageWrapper
            className={`media-preview ${elementIsSelected(filename) ? 'selected' : ''}`}
            onClick={handleSelectionEvent(filename)}
            alt={filename}
            src={src}
            key={filename}
          />
        ))}
        {allowedImageQuantity > 0 && (
          <label className='media-add' about='add-file'>
            <input type="file" id='add-file' onChange={onImageLoad} multiple />
            <h1 className="media-add-icon">+</h1>
          </label>
        )}
      </div>
      <div className="media-management">
        <div className="selected-media-management">
          {selections.length > 0 && (
            selections.length === 1 ? singleTargetManager : multipleTatgetsManager
          )}
        </div>
      </div>
    </div>
  );
};

export const ProductImageShowcaseInspector = forwardRef(ProductImageShowcaseInspectorComponent);