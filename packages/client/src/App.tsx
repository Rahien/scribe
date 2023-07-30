import { useState } from "react";
import "./App.css";
import { UploadMp3 } from "./UploadMp3";
import { tokens } from "./tokens";
import { TranscriptionLoading } from "./TranscriptionLoading";
import { ThemeProvider, createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  const [uploadId, setUploadId] = useState<string | null>(null);
  return (
    <ThemeProvider theme={darkTheme}>
      <div
        css={{
          margin: "0 auto",
          padding: tokens.spacing.large,
        }}
      >
        <h1>Scribe</h1>
        {uploadId ? (
          <TranscriptionLoading id={uploadId} />
        ) : (
          <UploadMp3 onUploadStarted={(id) => setUploadId(id)} />
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
