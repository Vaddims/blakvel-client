import { useEffect, useState } from "react";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { useDeleteProductThumbnailMutation, usePatchProductThumbsMutation, useUpdateThumbnailMutation } from "../../services/api/coreApi";
import * as path from 'path';
import * as uuid from 'uuid';
import ProductImageWrapper from "../ProductImageWrapper";
import "./productImageShowcaseInspector.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { ProductDto } from "../../dto/product/product.dto";

export const useProductImageShowcaseEditor = (product?: ProductDto) => {
  const [ patchThumbs ] = usePatchProductThumbsMutation();
  const [ updateThumbnail ] = useUpdateThumbnailMutation();
  const [ deleteThumbnail ] = useDeleteProductThumbnailMutation();

  const [ localThumbnailFile, setLocalThumbnailFile ] = useState<File>();
  const [ thumbnailSrc, setThumbnailSrc ] = useState<string | null>(
    product?.urn.thumbnail ? `/api/media/${product.urn.thumbnail}` : null
  );
 
  const downloadedProductThumbFilenames = product?.urn.thumbs ?? [];
  const [ downloadableThumbFilenames, setDownloadableThumbFilenames ] = useState(downloadedProductThumbFilenames);
  const [ localThumbFiles, setLocalThumbFiles ] = useState<File[]>([]);
  
  const [ localFileBlobMap, setLocalFileBlobMap ] = useState(new Map<string, string>());

  const selectableImageIdentificators = [...downloadableThumbFilenames, ...localFileBlobMap.keys()];
  if (thumbnailSrc) {
    selectableImageIdentificators.unshift(thumbnailSrc);
  }

  const {
    selections,
    selectOneElement,
    elementIsSelected,
    handleSelectionEvent,
  } = useSequentialElementSelection(selectableImageIdentificators, {
    dependencies: [product, thumbnailSrc, localFileBlobMap, thumbnailSrc],
  });

  useEffect(() => {
    if (!thumbnailSrc) {
      return;
    }

    if (selections.length === 0) {
      selectOneElement(thumbnailSrc)
    }
  }, [thumbnailSrc])

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

  useEffect(() => {
    setDownloadableThumbFilenames(product?.urn.thumbs ?? []);
    setThumbnailSrc(product?.urn.thumbnail ? `/api/media/${product.urn.thumbnail}` : null);
  }, [product?.id]);

  const uploadImages = async (id: string) => {
    const thumbFormData = new FormData();
    const thumbsToRemoveFilenames = product?.urn.thumbs.filter(
      (filename) => !downloadableThumbFilenames.includes(filename)
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
  }

  const removeSelectedImage = () => {
    setLocalThumbFiles(localThumbFiles.filter((file) => !elementIsSelected(file.name)));
    setDownloadableThumbFilenames(downloadableThumbFilenames.filter((filename) => !elementIsSelected(filename)));
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

  const allowedImageQuantity = 8 - downloadableThumbFilenames.length - localThumbFiles.length;
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
      downloadableThumbFilenames.includes(firstSelection) ?
        `/api/media/${firstSelection}` :
        localFileBlobMap.get(firstSelection) :
      '';

  const render = () => (
    <div className="product-image-editor">
      <div className="element-viewer">
        {selections.length === 1 ? (
          <ProductImageWrapper src={imageSource} alt="" />
        ) : (
          <div className="undisplayable-image-zone">
            <h1 className="undisplayable-image-header">{selections.length} products selected</h1>
          </div>
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
            <FontAwesomeIcon icon={faPlus} size='2x' />
          </label>
        )}
        <hr />
        {downloadableThumbFilenames.map((filename) => (
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
            {/* <h1 className="media-add-icon"></h1> */}
            <FontAwesomeIcon icon={faPlus} size='2x' />
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

  return {
    render,
    uploadImages,
  }
}