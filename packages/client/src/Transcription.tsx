import { Alert, LinearProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { AudioContextProvider, Audioplayer } from "./Audioplayer";
import { SkeletonSegment } from "./SkeletonSegment";
import { TranscriptionControls } from "./TranscriptionControls";
import { TranscriptionResult } from "./TranscriptionResult";
import { tokens } from "./tokens";
import { DataResponse, StatusResponse } from "./types";
import { swrFetcher } from "./utils";

export const Transcription = () => {
  const { id } = useParams();
  const [keepFetchingStatus, setKeepFetchingStatus] = useState(true);
  const { data: status, error: statusError } = useSWR<StatusResponse>(
    `http://localhost:3000/status/${id}`,
    swrFetcher,
    { refreshInterval: keepFetchingStatus ? 1000 : 0 }
  );
  const [currentData, setCurrentData] = useState<DataResponse | null>(null);
  const { data, error: dataError } = useSWR<DataResponse>(() => {
    if (!status || status.partsDone === 0) {
      return null;
    }
    if (!currentData || currentData.result.length < status.partsDone) {
      return `http://localhost:3000/result/${id}`;
    }
    return null;
  }, swrFetcher);

  useEffect(() => {
    if (!data) {
      return;
    }
    setCurrentData(data);
  }, [data]);
  const error = statusError || dataError || currentData?.error;

  const loading =
    !status || status.partsDone < status.totalParts || !status.totalParts;

  useEffect(() => {
    if (!status) {
      return;
    }
    if (status.partsDone === status.totalParts) {
      setKeepFetchingStatus(false);
    }
  }, [status]);

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

        <h2>Transcription of {status?.originalname}</h2>
        {status?.partsDone !== undefined && (
          <>
            <Audioplayer
              url={`http://localhost:3000/library/${id}/audio.mp3`}
            />
          </>
        )}
        <TranscriptionControls currentData={currentData} />
        <div>
          {loading ? (
            <p
              css={{
                fontStyle: "italic",
                ["@media print"]: {
                  display: "none",
                },
              }}
            >
              Transcription in progress. This can take a few minutes. As parts
              of the transcription become available, they will be shown on this
              page.
            </p>
          ) : (
            <div
              css={{
                ["@media print"]: {
                  display: "none",
                },
              }}
            >
              <p css={{ fontStyle: "italic" }}>
                Your transcription is now ready! You can safely copy the text
                below or use this button to copy the full text to your
                clipboard.
              </p>
            </div>
          )}
          {error && (
            <Alert
              severity="error"
              css={{
                marginBottom: tokens.spacing.small,
                textAlign: "left",
                whiteSpace: "pre-wrap",
              }}
            >
              Something went wrong while fetching the transcription status:
              {"\n"}
              {JSON.stringify(error, null, 2).split("\\n").join("\n")}
            </Alert>
          )}
          {loading && (
            <div
              css={{
                display: "flex",
                alignItems: "center",
                gap: tokens.spacing.small,
                marginBottom: tokens.spacing.small,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={
                  (status ? status.partsDone / (status.totalParts || 1) : 0) *
                  100
                }
                css={{ flexGrow: 1, height: 10, borderRadius: 4 }}
              />
              <div>
                {status?.partsDone} out of {status?.totalParts || "?"} parts
              </div>
            </div>
          )}
          {currentData && loading && (
            <Alert
              severity="warning"
              css={{ marginBottom: tokens.spacing.small }}
            >
              This is a partial transcription. The transcription is still being
              processed...
            </Alert>
          )}
          {currentData && <TranscriptionResult result={currentData} />}
          {loading && <SkeletonSegment />}
        </div>
      </div>
    </AudioContextProvider>
  );
};
