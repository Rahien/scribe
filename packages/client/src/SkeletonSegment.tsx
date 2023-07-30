import { Skeleton } from "@mui/material";
import { tokens } from "./tokens";

export const SkeletonSegment = () => {
  return (
    <div css={{ display: "flex", gap: tokens.spacing.small }}>
      <Skeleton variant="text" width={60} />
      <Skeleton variant="text" css={{ flexGrow: 1 }} />
    </div>
  );
};
