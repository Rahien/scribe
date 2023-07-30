import { AudioFile } from "@mui/icons-material";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { tokens } from "./tokens";
import { Button } from "@mui/material";
import { LanguageSelect } from "./LanguageSelect";
import { PartLengthSelect } from "./PartLengthSelect";
import { useLocalStorage } from "usehooks-ts";
const MAX_SIZE = 2000;

export const UploadMp3 = ({
  onUploadStarted,
}: {
  onUploadStarted: (id: string, file: File) => void;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useLocalStorage(
    "transcriptionLanguage",
    navigator.language.split("-")[0] || "en"
  );
  const [partLength, setPartLength] = useState(120);

  const handleChange = (file: File) => {
    setFile(file);
  };
  const fileTypes = ["mp3", "m4a", "wav"];

  const handleUpload = async () => {
    if (!file) {
      return;
    }
    const data = new FormData();
    data.append("file", file);
    data.append("lang", lang);
    data.append("partLength", partLength.toString());
    const response = await fetch("http://localhost:3000/transcribe", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: data,
    });
    const { id } = await response.json();
    onUploadStarted(id, file);
  };

  return (
    <div>
      <FileUploader
        handleChange={handleChange}
        name="file"
        types={fileTypes}
        label="Upload your recording here"
        maxSize={MAX_SIZE}
        minSize={0}
        onSizeError={() => {
          setError(
            `Your file is too large... Please upload a file smaller than ${MAX_SIZE}MB`
          );
        }}
      >
        <div
          css={{
            border: `${tokens.colors.blue} dashed 3px`,
            borderRadius: 4,
            padding: tokens.spacing.xlarge,
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.medium,
            cursor: "pointer",
            width: "100%",
            minHeight: 80,
            justifyContent: "center",
            boxSizing: "border-box",
            flexDirection: "column",
            [tokens.mediaQueries.aboveSmall]: {
              gap: tokens.spacing.large,
              flexDirection: "row",
            },
          }}
        >
          {file ? (
            file.name
          ) : (
            <p css={{ textAlign: "left", margin: 0 }}>
              Drop your recording here to start transcribing or use the button
              to select a file from your machine
            </p>
          )}
          {!file && (
            <Button
              variant="contained"
              color="primary"
              css={{
                display: "flex",
                gap: tokens.spacing.xsmall,
                flexShrink: 0,
                backgroundColor: tokens.colors.blue,
                color: tokens.colors.white,
              }}
            >
              <AudioFile />
              <span>Upload</span>
            </Button>
          )}
        </div>
      </FileUploader>
      <div
        css={{
          marginTop: tokens.spacing.small,
          marginBottom: tokens.spacing.small,
          display: "flex",
          justifyContent: "center",
          [tokens.mediaQueries.aboveSmall]: {
            flexDirection: "row",
          },
          flexDirection: "column",
          gap: tokens.spacing.xlarge,
        }}
      >
        <LanguageSelect lang={lang} setLang={setLang} />
        <PartLengthSelect length={partLength} setLength={setPartLength} />
      </div>
      {error && (
        <div
          css={{
            color: "red",
            fontWeight: "bold",
            marginTop: tokens.spacing.small,
            marginBottom: tokens.spacing.small,
          }}
        >
          {error}
        </div>
      )}
      <Button
        variant="contained"
        color="primary"
        css={{
          marginTop: tokens.spacing.large,
          ":disabled": {
            backgroundColor: tokens.colors.blue,
            opacity: 0.5,
            color: tokens.colors.white,
            cursor: "not-allowed",
            pointerEvents: "all",
          },
        }}
        disabled={!file}
        onClick={handleUpload}
      >
        Start Transcription
      </Button>
    </div>
  );
};
