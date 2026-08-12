import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { RouterProvider } from "react-router-dom";
import { store } from "./app/store";
import { muiTheme } from "./theme/muiTheme";
import { router } from "./routes/AppRouter";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
