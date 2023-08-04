import { AudioFile, Home } from "@mui/icons-material";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { tokens } from "./tokens";
import { Button } from "@mui/material";
import { LanguageSelect } from "./LanguageSelect";
import { PartLengthSelect } from "./PartLengthSelect";
import { useLocalStorage } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
const MAX_SIZE = 2000;

export const UploadMp3 = () => {
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();
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
    navigate(`/transcribing/${id}`);
  };

  return (
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
              border: `${tokens.colors.lightBlue} dashed 3px`,
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
                }}
              >
                <AudioFile />
                <span>Upload</span>
              </Button>
            )}
          </div>
        </FileUploader>

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
        <div
          css={{
            marginTop: tokens.spacing.small,
            marginBottom: tokens.spacing.small,
            display: "flex",
            justifyContent: "space-between",
            [tokens.mediaQueries.aboveSmall]: {
              flexDirection: "row",
            },
            flexDirection: "column",
            gap: tokens.spacing.xlarge,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate("/")}
          >
            <Home css={{ marginRight: tokens.spacing.xsmall }} />
            Back to Library
          </Button>
          <div css={{ display: "flex", gap: tokens.spacing.medium }}>
            <LanguageSelect lang={lang} setLang={setLang} />
            <PartLengthSelect length={partLength} setLength={setPartLength} />
          </div>
        </div>
        <Button
          variant="contained"
          color="primary"
          css={{
            marginTop: tokens.spacing.large,
            ":disabled": {
              opacity: 0.5,
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
    </div>
  );
};
