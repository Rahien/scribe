import { TranscriptionPart } from "./TranscriptionPart";
import { DataResponse } from "./types";
import { tokens } from "./tokens";
import { Fragment, useMemo } from "react";
import { SkeletonSegment } from "./SkeletonSegment";

const RedLine = () => {
  return <hr css={{ borderColor: tokens.colors.red }} />;
};

export const TranscriptionResult = ({
  result,
  showTimings,
}: {
  result: DataResponse;
  showTimings: boolean;
}) => {
  const resultAsSingleString = useMemo(() => {
    return result.result
      .map((part) => {
        return part.json.text;
      })
      .join(" ");
  }, [result]);
  if (!showTimings) {
    return <div css={{ fontSize: 14 }}>{resultAsSingleString}</div>;
  }

  return (
    <div>
      {result.result.map((part, index) => {
        return (
          <Fragment key={index}>
            {index < part.index && (
              <>
                <RedLine />
                <SkeletonSegment showTimings={showTimings} />
              </>
            )}
            {index > 0 && <RedLine />}
            <TranscriptionPart part={part} partLength={result.partLength} />
          </Fragment>
        );
      })}
    </div>
  );
};
