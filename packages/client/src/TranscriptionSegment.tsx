import { tokens } from "./tokens";
import { Part, Segment } from "./types";

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes - hours * 60);
  const remainingSeconds = Math.floor(seconds - minutes * 60);
  return `${hours ? hours + ":" : ""}${remainingMinutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const TranscriptionSegment = ({
  segment,
  part,
}: {
  segment: Segment;
  part: Part;
}) => {
  return (
    <div css={{ display: "flex", gap: tokens.spacing.small }}>
      <div css={{ width: 60, userSelect: "none" }}>
        {formatTime(120 * part.index + segment.start)}
      </div>
      <div css={{ textAlign: "left" }}>{segment.text}</div>
    </div>
  );
};