import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';
import Link from 'next/link';

// Needed so these are in the scope of the app, it thinks they're unused otherwise
Image.name;
Link.name;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div id="app-root">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
