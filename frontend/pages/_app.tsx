import '../styles/global.scss';
import { enableStaticRendering } from 'mobx-react-lite';

// Mobx SSR
const isServer = typeof window === 'undefined';
enableStaticRendering(isServer);

export default function MyApp({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}
