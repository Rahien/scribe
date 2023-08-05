import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { AudioContextProvider, Audioplayer } from "./Audioplayer";
import { TranscriptionControls } from "./TranscriptionControls";
import { TranscriptionResult } from "./TranscriptionResult";
import { tokens } from "./tokens";
import { DataResponse } from "./types";
import { swrFetcher } from "./utils";
import { useState } from "react";

export const LibraryTranscription = () => {
  const { id } = useParams();
  const [showTimings, setShowTimings] = useState(true);
  const { data, error } = useSWR<DataResponse>(
    `http://localhost:3000/library/${id}`,
    swrFetcher
  );

  if (error) {
    return (
      <Alert severity="error">
        Error loading transcription: {error.message || JSON.stringify(error)}
      </Alert>
    );
  }

  if (!data || !id) {
    return null;
  }

  return (
    <AudioContextProvider>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          gap: tokens.spacing.medium,
        }}
      >
        <h1 css={{ marginBottom: 0 }}>Scribe</h1>
        <h2 css={{ marginBottom: 0 }}>Transcription of {data.originalname}</h2>

        <TranscriptionControls
          currentData={data}
          showTimings={showTimings}
          setShowTimings={setShowTimings}
          id={id}
          allowDelete
        />
        <Audioplayer url={`http://localhost:3000/library/${id}/audio.mp3`} />
        <TranscriptionResult result={data} showTimings={showTimings} />
      </div>
    </AudioContextProvider>
  );
};
