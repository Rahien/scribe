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
  const [showTimings, setShowTimings] = useState(true);
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

  if (!id) {
    return null;
  }

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
        {status?.totalParts !== undefined && status?.totalParts > 0 && (
          <>
            <Audioplayer
              url={`http://localhost:3000/library/${id}/audio.mp3`}
            />
          </>
        )}
        <TranscriptionControls
          currentData={currentData}
          showTimings={showTimings}
          setShowTimings={setShowTimings}
          id={id}
        />
        <div
          css={{
            ["@media print"]: {
              display: "none",
            },
          }}
        >
          {loading ? (
            <Alert
              severity="warning"
              css={{
                fontStyle: "italic",
                marginBottom: tokens.spacing.medium,
                textAlign: "left",
              }}
            >
              Transcription in progress. This can take a few minutes. As parts
              of the transcription become available, they will be shown on this
              page. <strong>This is NOT the final transcription.</strong>
            </Alert>
          ) : (
            <div
              css={{
                ["@media print"]: {
                  display: "none",
                },
              }}
            >
              <Alert
                severity="success"
                css={{
                  fontStyle: "italic",
                  marginBottom: tokens.spacing.medium,
                }}
              >
                Your transcription is now ready! The text below can now be
                safely copied or printed.
              </Alert>
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
        </div>
        {currentData && (
          <TranscriptionResult result={currentData} showTimings={showTimings} />
        )}
        {loading && <SkeletonSegment showTimings={showTimings} />}
      </div>
    </AudioContextProvider>
  );
};
