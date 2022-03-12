import Image from 'next/image';

export interface ImageProps {
  alt: string;
  source: string;
}

export const ReactImage = ({ alt, source }: ImageProps) => {
  console.log('alt', alt, 'source', source);
  return <Image alt={alt} width={200} height={200} src={source} />;
};
