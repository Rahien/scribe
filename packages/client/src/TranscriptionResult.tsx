import { TranscriptionPart } from "./TranscriptionPart";
import { DataResponse } from "./types";
import { tokens } from "./tokens";
import { Fragment } from "react";

const RedLine = () => {
  return <hr css={{ borderColor: tokens.colors.red }} />;
};

export const TranscriptionResult = ({ result }: { result: DataResponse }) => {
  return (
    <div>
      {result.result.map((part, index) => {
        return (
          <Fragment key={index}>
            {index > 0 && <RedLine />}
            <TranscriptionPart part={part} partLength={result.partLength} />
          </Fragment>
        );
      })}
    </div>
  );
};
