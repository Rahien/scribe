import { Alert, Button, Dialog } from "@mui/material";
import { tokens } from "./tokens";

export const ConfirmDeleteDialog = ({
  onClose,
  afterDelete,
  id,
}: {
  onClose: () => void;
  afterDelete: () => void;
  id: string;
}) => {
  const removeItem = () => {
    fetch(`http://localhost:3000/library/${id}`, {
      method: "DELETE",
    }).then(() => {
      afterDelete();
    });
  };
  return (
    <Dialog open={true}>
      <div
        css={{
          padding: `${tokens.spacing.medium}px ${tokens.spacing.large}px`,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: tokens.spacing.medium,
        }}
      >
        <h2 css={{ marginBottom: 0, marginTop: 0 }}>Are you sure?</h2>
        <div css={{ "> p": { margin: 0 } }}>
          <p>Are you sure you want to remove this item?</p>{" "}
          <Alert severity="warning" css={{ marginTop: tokens.spacing.medium }}>
            This action cannot be undone!
          </Alert>
        </div>
        <div css={{ display: "flex", gap: tokens.spacing.small }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              removeItem();
            }}
          >
            Yes
          </Button>
          <Button variant="outlined" color="primary" onClick={() => onClose()}>
            No
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
