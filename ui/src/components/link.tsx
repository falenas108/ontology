import { default as NextLink, LinkProps } from 'next/link';
import React from 'react';

export const Link = ({ children, href, ...props }: React.PropsWithChildren<Partial<LinkProps>>) => {
  return (
    <NextLink passHref href={href ?? ''} {...props}>
      <a>{children}</a>
    </NextLink>
  );
};
