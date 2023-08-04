import { ThemeProvider, createTheme } from "@mui/material";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { Library } from "./Library";
import { LibraryTranscription } from "./LibraryTranscription";
import { Transcription } from "./Transcription";
import { UploadMp3 } from "./UploadMp3";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Library />,
  },
  {
    path: "/new",
    element: <UploadMp3 />,
  },
  {
    path: "/transcribing/:id",
    element: <Transcription />,
  },
  {
    path: "/library/:id",
    element: <LibraryTranscription />,
  },
]);
function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
