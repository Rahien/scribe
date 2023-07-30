import { TranscriptionSegment } from "./TranscriptionSegment";
import { Part } from "./types";

export const TranscriptionPart = ({ part }: { part: Part }) => {
  return (
    <div>
      {part.json.segments.map((segment, index) => {
        return (
          <>
            <TranscriptionSegment key={index} segment={segment} part={part} />
          </>
        );
      })}
    </div>
  );
};
