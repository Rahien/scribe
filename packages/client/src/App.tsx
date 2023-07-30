import { useState } from "react";
import "./App.css";
import { UploadMp3 } from "./UploadMp3";
import { tokens } from "./tokens";
import { TranscriptionLoading } from "./TranscriptionLoading";

function App() {
  const [uploadId, setUploadId] = useState<string | null>(null);
  return (
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
  );
}

export default App;
