import { Skeleton } from "@mui/material";
import { tokens } from "./tokens";

export const SkeletonSegment = ({ showTimings }: { showTimings: boolean }) => {
  return (
    <div css={{ display: "flex", gap: tokens.spacing.small }}>
      {showTimings && <Skeleton variant="text" width={60} />}
      <Skeleton variant="text" css={{ flexGrow: 1 }} />
    </div>
  );
};
