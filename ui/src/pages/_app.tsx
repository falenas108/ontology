import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Image from 'next/image';
Image.name; // Needed so image is in the scope of the app, it isn't recognizing it deeply otherwise

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div id="app-root">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
