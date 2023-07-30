import { PlayCircle } from "@mui/icons-material";
import { tokens } from "./tokens";
import { Part, Segment } from "./types";
import { useContext } from "react";
import { AudioContext } from "./Audioplayer";

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
  partLength,
}: {
  segment: Segment;
  part: Part;
  partLength: number;
}) => {
  const { setSelectedTime } = useContext(AudioContext);
  const time = partLength * part.index + segment.start;
  return (
    <div
      css={{
        display: "flex",
        gap: tokens.spacing.small,
        cursor: "pointer",
        "&:hover": {
          background: tokens.colors.black,
        },
      }}
      onClick={() => {
        setSelectedTime(time);
      }}
    >
      <div
        css={{
          width: 70,
          userSelect: "none",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.xsmall,
        }}
      >
        <PlayCircle
          fontSize="small"
          css={{
            ["@media print"]: {
              display: "none",
            },
          }}
        />
        {formatTime(time)}
      </div>
      <div css={{ textAlign: "left" }}>{segment.text}</div>
    </div>
  );
};
