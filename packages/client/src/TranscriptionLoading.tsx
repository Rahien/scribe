import useSWR from "swr";
import { swrFetcher } from "./utils";
import { useEffect, useState } from "react";
import { Alert, Button, LinearProgress } from "@mui/material";
import { tokens } from "./tokens";
import { DataResponse, StatusResponse } from "./types";
import { TranscriptionResult } from "./TranscriptionResult";
import { ContentPaste } from "@mui/icons-material";

export const TranscriptionLoading = ({ id }: { id: string }) => {
  const { data: status, error: statusError } = useSWR<StatusResponse>(
    `http://localhost:3000/status/${id}`,
    swrFetcher,
    { refreshInterval: 1000 }
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
  const error = statusError || dataError;

  const loading =
    !status || status.partsDone < status.totalParts || status.totalParts === 0;

  const [copied, setCopied] = useState(false);

  return (
    <div>
      <h2>Transcription {loading ? "loading..." : "done!"}</h2>
      {loading ? (
        <p>
          Your transcription of {status?.originalName || "your file"} is being
          processed. This can take a few minutes. As parts of the transcription
          become available, they will be shown on this page.
        </p>
      ) : (
        <div>
          <p>
            Your transcription is now ready! You can safely copy the text below
            or use this button to copy the full text to your cliboard.
          </p>
          <Button
            variant="contained"
            color="primary"
            css={{
              width: "250px",
              display: "flex",
              justifyContent: "center",
              margin: "0 auto",
              marginBottom: tokens.spacing.large,
            }}
            onClick={() => {
              if (!currentData) {
                return;
              }
              navigator.clipboard.writeText(
                currentData?.result
                  .map((part) => {
                    return part.json.text;
                  })
                  .join("\n")
              );
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 2000);
            }}
          >
            <ContentPaste css={{ marginRight: tokens.spacing.xsmall }} />
            {copied ? "Copied!" : "Copy to clipboard"}
          </Button>
        </div>
      )}
      {error && (
        <div>
          Something went wrong while fetching the transcription status:{" "}
          {JSON.stringify(error)}
        </div>
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
              (status ? status.partsDone / (status.totalParts || 1) : 0) * 100
            }
            css={{ flexGrow: 1, height: 10, borderRadius: 4 }}
          />
          <div>
            {status?.partsDone} out of {status?.totalParts} parts
          </div>
        </div>
      )}
      {currentData && loading && (
        <Alert severity="warning" css={{ marginBottom: tokens.spacing.small }}>
          This is a partial transcription. The transcription is still being
          processed...
        </Alert>
      )}
      {currentData && <TranscriptionResult result={currentData} />}
    </div>
  );
};
