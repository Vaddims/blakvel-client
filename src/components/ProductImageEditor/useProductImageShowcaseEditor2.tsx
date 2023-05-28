import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSequentialElementSelection } from "../../middleware/hooks/useSequentialElementSelection";
import { Product } from "../../models/product.model";
import { useDeleteProductThumbnailMutation, usePatchProductThumbsMutation, useUpdateThumbnailMutation } from "../../services/api/productsApi";
import * as path from 'path';
import * as uuid from 'uuid';
import ProductImageShowcaseEditor from './productImageShowcaseEditor';

enum ThumbnailSource {
  Uploaded,
  Downloaded,
}

export const useProductImageShowcaseEditor = (product?: Product) => {
  const navigate = useNavigate();
  const [ patchThumbs ] = usePatchProductThumbsMutation();
  const [ updateThumbnail ] = useUpdateThumbnailMutation();
  const [ deleteThumbnail ] = useDeleteProductThumbnailMutation();

  const [ 
    downloadableThumbFilenames, 
    setDownloadableThumbFilenames 
  ] = useState(product ? [...product.urn.thumbs] : []);
  const [ uploadedThumbFiles, setUploadedThumbFiles ] = useState<File[]>([]);
  const [ uploadedThumbBlobMap, setUploadedThumbBlobMap ] = useState<Map<string, string>>(new Map());
  
  const [ thumbnailFilename, setThumbnailFilename ] = useState(product?.urn.thumbnail);
  const [ uploadedThumbnailFile, setUploadedThumbnailFile ] = useState<File>();
  const [ uploadedThumbnailBlob, setUploadedThumbnailBlob ] = useState<string>();
  
  const addableImageQuantity = 8 - downloadableThumbFilenames.length - uploadedThumbFiles.length;
  const selectableFilenames = [...downloadableThumbFilenames, ...uploadedThumbBlobMap.keys()];
  if (thumbnailFilename) {
    selectableFilenames.unshift(thumbnailFilename);
  }

  const {
    selections,
    elementIsSelected,
    deselectAllSelections,
    handleSelectionEvent,
  } = useSequentialElementSelection(selectableFilenames, {
    dependencies: [downloadableThumbFilenames, uploadedThumbBlobMap, thumbnailFilename],
  });

  useEffect(() => {
    if (!uploadedThumbnailFile) {
      return;
    }

    const url = URL.createObjectURL(uploadedThumbnailFile);
    setThumbnailFilename(uploadedThumbnailFile.name);

    return () => {
      URL.revokeObjectURL(url);
    }
  }, [uploadedThumbnailFile]);

  useEffect(() => {
    setUploadedThumbBlobMap((blobMap) => {
      if (blobMap.size === 0 && uploadedThumbFiles.length === 0) {
        return blobMap;
      }

      const uploadedFilesToBlobEntry = (file: File) => [file.name, URL.createObjectURL(file)] as const;
      const uploadedBlobEntries = uploadedThumbFiles.map(uploadedFilesToBlobEntry);
      return new Map(uploadedBlobEntries);
    });

    return () => {
      uploadedThumbBlobMap.forEach((url) => URL.revokeObjectURL(url));
    }
  }, [uploadedThumbFiles]);

  useEffect(() => {
    setDownloadableThumbFilenames(product ? [...product.urn.thumbs] : []);
    setThumbnailFilename(product?.urn.thumbnail);
  }, [product]);
  
  const removeSelectedImages = () => {
    setUploadedThumbFiles(uploadedThumbFiles.filter((file) => !elementIsSelected(file.name)));
    setDownloadableThumbFilenames(downloadableThumbFilenames.filter((filename) => !elementIsSelected(filename)));
    if (thumbnailFilename && elementIsSelected(thumbnailFilename)) {
      setThumbnailFilename(undefined);
      setUploadedThumbnailFile(undefined);
    }
  }

  const normalizeImage = (file: File) => {
    const fileExtension = path.extname(file.name);
    const blob = new Blob([file], { type: file.type });
    const uuidFilename = uuid.v4() + fileExtension;
    const image = new File([blob], uuidFilename, { type: file.type });
    return image;
  }

  const thumbUploadHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const files = [...event.target.files].slice(0, addableImageQuantity);
    const images = files.map(normalizeImage);

    setUploadedThumbFiles([...uploadedThumbFiles, ...images]);
    setThumbnailFilename(images[0].name);
  }

  const thumbnailUploadHandler: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const image = normalizeImage(file);
    setUploadedThumbnailFile(image);
    setThumbnailFilename(image.name);
  }

  const firstSelection = selections[0];

  const render = () => (
    <ProductImageShowcaseEditor
      selections={selections}
      addableImageQuantity={addableImageQuantity}
      downloadableThumbFilenames={downloadableThumbFilenames}
      imageSelectionQuantity={selections.length}
      uploadedThumbBlobEntries={[...uploadedThumbBlobMap.entries()]}
      thumbnailSrc={uploadedThumbnailFile ? uploadedThumbnailBlob : (thumbnailFilename && `/api/media/${thumbnailFilename}`)}
      onThumbnailChange={thumbnailUploadHandler}
      onThumbnailClick={thumbnailFilename ? handleSelectionEvent(thumbnailFilename) : undefined}
      onDownloadableThumbClick={handleSelectionEvent}
      onThumbAddChange={thumbUploadHandler}
      onImageRemove={removeSelectedImages}
      elementIsSelected={elementIsSelected}
    />
  )

  return {
    render,
  }
}