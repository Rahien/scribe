import { FormControl, MenuItem, Select, Tooltip } from "@mui/material";
import { tokens } from "./tokens";
import { Info } from "@mui/icons-material";

export const PartLengthSelect = ({
  length,
  setLength,
}: {
  length: number;
  setLength: (length: number) => void;
}) => {
  const options = [30, 60, 120, 180, 240, 300];
  return (
    <div
      css={{ display: "flex", gap: tokens.spacing.small, alignItems: "center" }}
    >
      <Tooltip title="The length of each part of the transcription. Longer parts means less potential data loss because of cutting points, but longer waits for incremental feedback">
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.xsmall,
          }}
        >
          <Info />
          <div>Part length:</div>
        </div>
      </Tooltip>
      <FormControl variant="standard" size="medium">
        <Select
          value={length}
          css={{ padding: tokens.spacing.xsmall }}
          onChange={(e) => {
            setLength(e.target.value as number);
          }}
        >
          {options.map((len) => {
            return (
              <MenuItem value={len} key={len}>
                {len}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
