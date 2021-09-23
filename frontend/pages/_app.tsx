import "../styles/global.scss";
import { enableStaticRendering } from "mobx-react-lite";
import { RootStoreProvider } from "../stores/stores";

// Mobx SSR
const isServer = typeof window === "undefined";
enableStaticRendering(isServer);

export default function MyApp({ Component, pageProps }) {
  return (
    <RootStoreProvider hydrationData={pageProps.hydrationData}>
      <Component {...pageProps} />
    </RootStoreProvider>
  );
}
