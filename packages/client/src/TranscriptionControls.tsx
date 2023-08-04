import { Check, ContentPaste, Home, Print } from "@mui/icons-material";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "./tokens";
import { DataResponse } from "./types";

export const TranscriptionControls = ({
  currentData,
}: {
  currentData: DataResponse | null;
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  return (
    <div css={{ display: "flex", gap: tokens.spacing.small }}>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate("/")}
      >
        <Home css={{ marginRight: tokens.spacing.xsmall }} />
        Back to Library
      </Button>
      <div
        css={{
          display: "flex",
          gap: tokens.spacing.xsmall,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Show Chunks and Timings"
        />

        <Button
          variant="outlined"
          color="primary"
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
          {copied ? (
            <Check color="success" />
          ) : (
            <ContentPaste css={{ marginRight: tokens.spacing.xsmall }} />
          )}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.print()}
        >
          <Print />
        </Button>
      </div>
    </div>
  );
};
