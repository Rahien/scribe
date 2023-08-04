import { TranscriptionSegment } from "./TranscriptionSegment";
import { Part } from "./types";

export const TranscriptionPart = ({
  part,
  partLength,
}: {
  part: Part;
  partLength: number;
}) => {
  return (
    <div>
      {!part.json.segments && <div>No transcription found for this part</div>}
      {part.json.segments?.map((segment, index) => {
        return (
          <TranscriptionSegment
            key={index}
            segment={segment}
            part={part}
            partLength={partLength}
          />
        );
      })}
    </div>
  );
};
