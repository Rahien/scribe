import { useState } from "react";
import "./App.css";
import { UploadMp3 } from "./UploadMp3";
import { tokens } from "./tokens";
import { Transcription } from "./Transcription";
import { ThemeProvider, createTheme } from "@mui/material";
import { AudioContextProvider, Audioplayer } from "./Audioplayer";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
function App() {
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  return (
    <ThemeProvider theme={darkTheme}>
      <AudioContextProvider>
        <div
          css={{
            margin: "0 auto",
            padding: tokens.spacing.large,
          }}
        >
          <h1>Scribe</h1>
          {file && <Audioplayer file={file} />}
          {uploadId ? (
            <Transcription id={uploadId} />
          ) : (
            <UploadMp3
              onUploadStarted={(id, file) => {
                setUploadId(id);
                setFile(file);
              }}
            />
          )}
        </div>
      </AudioContextProvider>
    </ThemeProvider>
  );
}

export default App;
