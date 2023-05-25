import { useState, useEffect } from 'react';

export enum PCImageType {
  front,
  back,
  icon
}

// Helper function to convert enum variable to string name
export const getEnumName = (enumType: any, enumValue: any): string => {
  const keys = Object.keys(enumType).filter(key => enumType[key] === enumValue);
  return keys.length > 0 ? keys[0] : '';
};

export const LoadPCImage = (props: {classIndex: string | undefined, imageType: PCImageType}) => {
  const {classIndex, imageType } = props;
  const imageType_name = getEnumName(PCImageType, imageType);

  const [imageSrc, setImageSrc] = useState(null);

  // useEffect(() => {
    const loadImage = async () => {
      try {
        const image = await import(`../../assets/pokemon/${classIndex}_${imageType_name}.png`);
        setImageSrc(image.default);
      } catch (error) {
        console.error('Failed to load image:', error);
      }
    }
    loadImage();
  // }, [])

  return (
    <div className="my-2 flex">
      {imageSrc ? (
        <img src={imageSrc} alt="Example" className="w-32" />
      ) : (
        <p className="text-yellow-500 mx-2">Loading image...</p>
      )}
    </div>
  );
}