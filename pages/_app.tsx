import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
};

export default App;
