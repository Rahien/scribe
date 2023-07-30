import { TranscriptionPart } from "./TranscriptionPart";
import { DataResponse } from "./types";
import { tokens } from "./tokens";

const RedLine = () => {
  return <hr css={{ borderColor: tokens.colors.red }} />;
};

export const TranscriptionResult = ({ result }: { result: DataResponse }) => {
  return (
    <div>
      {result.result.map((part, index) => {
        return (
          <>
            {index > 0 && <RedLine />}
            <TranscriptionPart
              key={index}
              part={part}
              partLength={result.partLength}
            />
          </>
        );
      })}
    </div>
  );
};
