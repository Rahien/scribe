import { AddCircle, ArrowCircleRight, Delete } from "@mui/icons-material";
import { Alert, Button, Card, Dialog } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { tokens } from "./tokens";
import { swrFetcher } from "./utils";
import { useMemo, useState } from "react";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

type LibraryResponse = {
  id: string;
  originalname: string;
  createdAt: string;
  size: number;
  mimetype: string;
}[];

const LibraryEntry = ({ item }: { item: LibraryResponse[0] }) => {
  const navigate = useNavigate();

  const [tryingRemove, setTryingRemove] = useState(false);
  const formattedItemSize = useMemo(() => {
    const kbSize = Math.round(item.size / 1024);
    if (kbSize > 1024) {
      return `${Math.round(kbSize / 1024)} MB`;
    }
    return `${Math.round(item.size / 1024)} KB`;
  }, [item]);
  return (
    <>
      <div
        onClick={() => {
          navigate(`/library/${item.id}`);
        }}
        css={{
          padding: tokens.spacing.small,
          display: "flex",
          gap: tokens.spacing.xsmall,
          "> *": { width: 100 },
        }}
      >
        <div css={{ width: 150 }}>
          {dayjs(item.createdAt).format("YYYY-MM-DD HH:mm")}
        </div>
        <div css={{ flexGrow: 1, width: "unset" }}>{item.originalname}</div>
        <div>{formattedItemSize}</div>
        <div>{item.mimetype}</div>
        <div
          css={{
            display: "flex",
            flexShrink: 1,
            width: "unset",
            justifyContent: "flex-end",
            "> button": {
              minWidth: 0,
            },
          }}
        >
          <Button variant="text" color="primary" size="small" aria-label="view">
            <ArrowCircleRight />
          </Button>
          <Button
            variant="text"
            color="error"
            size="small"
            aria-label="remove"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              setTryingRemove(true);
            }}
          >
            <Delete />
          </Button>
        </div>
      </div>
      {tryingRemove && (
        <ConfirmDeleteDialog
          id={item.id}
          onClose={() => setTryingRemove(false)}
          afterDelete={() => {
            window.location.reload();
          }}
        />
      )}
    </>
  );
};

export const Library = () => {
  const navigate = useNavigate();
  const { data, error } = useSWR<LibraryResponse>(
    "http://localhost:3000/library",
    swrFetcher
  );

  return (
    <div
      css={{
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.large,
      }}
    >
      <h1 css={{ marginBottom: 0 }}>Scribe Library</h1>
      <Button
        onClick={() => navigate("/new")}
        variant="contained"
        color="primary"
        size="large"
      >
        <AddCircle css={{ marginRight: tokens.spacing.small }} />
        Start new transcription
      </Button>
      {error && (
        <Alert severity="error">Error loading library: {error.message}</Alert>
      )}
      <Card
        css={{
          marginTop: tokens.spacing.medium,
          "> *:nth-child(even)": {
            backgroundColor: tokens.colors.grey,
          },
          "> *:hover": {
            color: tokens.colors.yellow,
            cursor: "pointer",
          },
        }}
      >
        {data && data.map((item) => <LibraryEntry item={item} key={item.id} />)}
      </Card>
    </div>
  );
};
