import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import { tokens } from "./tokens";
import { Info } from "@mui/icons-material";

export const LanguageSelect = ({
  lang,
  setLang,
}: {
  lang: string;
  setLang: (lang: string) => void;
}) => {
  const languages = [
    "af",
    "am",
    "ar",
    "as",
    "az",
    "ba",
    "be",
    "bg",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "cs",
    "cy",
    "da",
    "de",
    "el",
    "en",
    "es",
    "et",
    "eu",
    "fa",
    "fi",
    "fo",
    "fr",
    "gl",
    "gu",
    "ha",
    "haw",
    "he",
    "hi",
    "hr",
    "ht",
    "hu",
    "hy",
    "id",
    "is",
    "it",
    "ja",
    "jw",
    "ka",
    "kk",
    "km",
    "kn",
    "ko",
    "la",
    "lb",
    "ln",
    "lo",
    "lt",
    "lv",
    "mg",
    "mi",
    "mk",
    "ml",
    "mn",
    "mr",
    "ms",
    "mt",
    "my",
    "ne",
    "nl",
    "nn",
    "no",
    "ny",
    "or",
    "pa",
    "pl",
    "ps",
    "pt",
    "ro",
    "ru",
    "sa",
    "sd",
    "si",
    "sk",
    "sl",
    "sn",
    "so",
    "sq",
    "sr",
    "st",
    "su",
    "sv",
    "sw",
    "ta",
    "te",
    "tg",
    "th",
    "tk",
    "tl",
    "tr",
    "tt",
    "uk",
    "ur",
    "uz",
    "vi",
    "yi",
    "yo",
    "zh",
  ];
  return (
    <div
      css={{ display: "flex", gap: tokens.spacing.small, alignItems: "center" }}
    >
      <Tooltip title="The target language of the transcript. Can also be used to translate the transcript.">
        <div
          css={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.xsmall,
          }}
        >
          <Info />
          <div>Language:</div>
        </div>
      </Tooltip>

      <FormControl variant="standard" size="medium">
        <Select
          value={lang}
          css={{ padding: tokens.spacing.xsmall }}
          onChange={(e) => {
            setLang(e.target.value as string);
          }}
        >
          {languages.map((lang) => {
            return (
              <MenuItem value={lang} key={lang}>
                {lang}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
