import { default as NextImage, ImageProps } from 'next/image';

export const Image = ({ src, alt, children, ...props }: Partial<ImageProps>) => {
  if (!src) {
    console.warn(
      'You must define a src for your image, what do you expect me to show without a src?'
    );
    return <div />;
  }
  if (!alt) {
    console.warn('You must define an alt to show an image');
    return <div />;
  }
  return <NextImage alt={alt} src={src} {...props} />;
};
