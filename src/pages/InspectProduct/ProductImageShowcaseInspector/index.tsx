import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { usePatchProductThumbsMutation, useUpdateThumbnailMutation, useDeleteProductThumbnailMutation } from '../../../services/api/coreApi';
import ProductImageWrapper from "../../../components/ProductImageWrapper";
import { useSequentialElementSelection } from "../../../middleware/hooks/useSequentialElementSelection";
import { useNavigate } from "react-router-dom";
import * as uuid from 'uuid';
import * as path from 'path';
import { ProductDto } from "../../../dto/product/product.dto";

export interface IInspectProductImageGallaryProps {
  product: ProductDto;
}

export interface IInspectProductImageGallaryPublic {
  uploadImages: () => void;
  deselectAllElements: () => void;
}

export const InspectProductImageGallary: React.ForwardRefRenderFunction<IInspectProductImageGallaryPublic, IInspectProductImageGallaryProps>
  = (props, ref) => {
  const { product } = props;

  const thumbnailPath = product.urn.thumbnail ? `/api/media/${product.urn.thumbnail}` : null;

  const initialImageFilenames: string[] = []; 
  const initialTargets: string[] = [];
  if (product) {
    const { thumbs } = product.urn;
    initialImageFilenames.push(...thumbs);
  }

  const [ patchThumbs ] = usePatchProductThumbsMutation();
  const [ updateThumbnail ] = useUpdateThumbnailMutation();
  const [ deleteThumbnail ] = useDeleteProductThumbnailMutation();

  const navigate = useNavigate();
  const [ thumbnailFile, setThumbnailFile ] = useState<File>();
  const [ thumbnailSrc, setThumbnailSrc ] = useState<string | null>(thumbnailPath);

  const [ imageFilenames, setImageFilenames ] = useState(initialImageFilenames);
  const [ files, setFiles ] = useState<File[]>([]);
  const [ previewMap, setPreviewMap ] = useState<Map<string, string>>(new Map);

  useEffect(() => {
    const blobMap = new Map<string, string>();
    for (const file of files) {
      blobMap.set(file.name, URL.createObjectURL(file));
    }
    setPreviewMap(blobMap);

    return () => {
      previewMap.forEach(url => URL.revokeObjectURL(url));
    }
  }, [files]);

  useEffect(() => {
    if (!thumbnailFile) {
      return;
    }
    
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailSrc(url);

    // return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const selectionElements = [...imageFilenames, ...previewMap.keys()];
  if (thumbnailSrc) {
    selectionElements.unshift(thumbnailSrc);
  }

  const {
    selections,
    elementIsSelected,
    deselectAllSelections,
    handleSelectionEvent,
  } = useSequentialElementSelection(selectionElements, {
    targets: initialTargets,
    dependencies: [previewMap, thumbnailSrc],
  });

  useImperativeHandle(ref, () => ({
    async uploadImages() {
      const thumbFormData = new FormData();
      const thumbsToRemoveFilenames = product.urn.thumbs.filter(
        (filename) => !imageFilenames.includes(filename)
      );

      for (const filename of thumbsToRemoveFilenames) {
        thumbFormData.append("remove", filename);
      }

      for (const file of files) {
        thumbFormData.append("add", file, file.name);
      }

      await patchThumbs({
        id: product.id,
        formData: thumbFormData,
      });

      if (!thumbnailSrc) {
        await deleteThumbnail(product.id);
      } else if (thumbnailFile) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append('file', thumbnailFile, thumbnailFile.name);
        await updateThumbnail({
          id: product.id,
          formData: thumbnailFormData,
        });
      }

      navigate(`/products/${product.id}`);
    },

    deselectAllElements() {
      deselectAllSelections();
    }
  }));

  const removeImageFilenames = () => {
    setFiles(files.filter((file) => !elementIsSelected(file.name)));
    setImageFilenames(imageFilenames.filter((imageFilename) => !elementIsSelected(imageFilename)));
    if (thumbnailSrc && selections.includes(thumbnailSrc)) {
      setThumbnailFile(undefined);
      setThumbnailSrc(null);
    }
  }

  const multipleTatgetsManager = (
    <>
      <button className="selected-media-action" onClick={removeImageFilenames}>Remove {selections.length} Images</button>
    </>
  );

  const singleTargetManager = (
    <>
      <button className="selected-media-action" onClick={removeImageFilenames}>Remove Image</button>
    </>
  );

  const noTargetManager = (
    <></>
  )

  const allowedImageQuantity = 8 - imageFilenames.length - files.length;
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
    setFiles([...files, ...fileArrayInBoundary]);
  }

  const onThumbnailLoad: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setThumbnailFile(file);
  }

  const firstSelection = selections[0];

  return (
    <div className="photogallery-showcase-boundary">
      <div className="media-showcase product-image-boundary">
        {selections.length === 1 ? (
          (firstSelection === thumbnailSrc ? (
            <img
              src={thumbnailSrc} 
              className="product-image"
              alt="Product image"
            />
          ) : (
          <img
            src={
              imageFilenames.includes(firstSelection) 
                ? `/api/media/${firstSelection}` 
                : previewMap.get(firstSelection)
            } 
            className="product-image"
            alt="Product image"
          />
        ))) : (
          <h1 className="media-undisplayable-title">{selections.length} products selected</h1>
        )}
      </div>
      <div className="media-preview-collection">
        {thumbnailSrc ? (
          <ProductImageWrapper
            onClick={handleSelectionEvent(thumbnailSrc)}
            className={`media-preview ${elementIsSelected(thumbnailSrc) ? 'selected' : ''}`}
            alt={'Product image'}
            src={thumbnailSrc}
          />
        ) : (
          <label className='media-add' about='add-file'>
            <input type="file" id='add-file' onChange={onThumbnailLoad} />
            <h1 className="media-add-icon">+</h1>
          </label>
        )}
        <hr />
        {imageFilenames.map((filename) => (
          <ProductImageWrapper
            className={`media-preview ${elementIsSelected(filename) ? 'selected' : ''}`}
            onClick={handleSelectionEvent(filename)}
            loading="lazy"
            title={filename}
            alt={filename}
            src={`/api/media/${filename}`}
            key={filename}
          />
        ))}
        {[...previewMap].map(([filename, src]) => (
          <ProductImageWrapper
            className={`media-preview ${elementIsSelected(filename) ? 'selected' : ''}`}
            onClick={handleSelectionEvent(filename)}
            loading="lazy"
            title={filename}
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
          {selections.length > 0 ? (
            selections.length === 1 ? singleTargetManager : multipleTatgetsManager
          ) : noTargetManager}
        </div>
      </div>
    </div>
  );
};

export const InspectProductImageGallaryRef = forwardRef(InspectProductImageGallary);