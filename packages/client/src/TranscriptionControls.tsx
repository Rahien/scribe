import { Check, ContentPaste, Delete, Home, Print } from "@mui/icons-material";
import { Button, FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "./tokens";
import { DataResponse } from "./types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export const TranscriptionControls = ({
  currentData,
  showTimings,
  setShowTimings,
  id,
  allowDelete = false,
}: {
  id: string;
  currentData: DataResponse | null;
  showTimings: boolean;
  setShowTimings: (show: boolean) => void;
  allowDelete?: boolean;
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [tryingToRemove, setTryingToRemove] = useState(false);
  return (
    <div
      css={{
        display: "flex",
        gap: tokens.spacing.small,
        ["@media print"]: {
          display: "none",
        },
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
      <div
        css={{
          display: "flex",
          gap: tokens.spacing.xsmall,
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              defaultChecked={showTimings}
              onChange={(e) => {
                setShowTimings(e.currentTarget.checked);
              }}
            />
          }
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
        {allowDelete && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setTryingToRemove(true);
            }}
          >
            <Delete />
          </Button>
        )}
      </div>
      {tryingToRemove && (
        <ConfirmDeleteDialog
          id={id}
          afterDelete={() => navigate("/")}
          onClose={() => setTryingToRemove(false)}
        />
      )}
    </div>
  );
};
