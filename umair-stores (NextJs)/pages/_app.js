import "../styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../src/theme/theme";
import FullLayout from "../src/layouts/FullLayout";
import { Provider } from "react-redux";
import store from "../src/store/Store";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <FullLayout>
          <Component {...pageProps} />
        </FullLayout>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
