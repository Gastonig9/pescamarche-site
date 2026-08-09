import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { theme } from "./styles/theme";
import { GlobalStyle } from "./styles/GlobalStyle";
import { router } from "./routes/AppRouter";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
