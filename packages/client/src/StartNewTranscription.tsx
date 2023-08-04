import { Home } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { AudioContextProvider, Audioplayer } from "./Audioplayer";
import { Transcription } from "./Transcription";
import { UploadMp3 } from "./UploadMp3";
import { tokens } from "./tokens";

export const StartNewTranscription = () => {
  const [uploadId, setUploadId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  return (
    <AudioContextProvider>
      <div
        css={{
          margin: "0 auto",
          padding: tokens.spacing.large,
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.medium,
        }}
      >
        <h1 css={{ marginBottom: 0 }}>Scribe</h1>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/")}
        >
          <Home css={{ marginRight: tokens.spacing.xsmall }} />
          Back to Library
        </Button>

        {file && (
          <>
            <h2>Transcription of {file.name}</h2>
            <Audioplayer file={file} />
          </>
        )}
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
  );
};
