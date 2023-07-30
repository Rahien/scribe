export type Segment = {
  start: number;
  end: number;
  text: string;
};
export type Part = {
  index: number;
  json: {
    text: string;
    segments: Segment[];
  };
};

export type DataResponse = {
  originalName: string;
  result: Part[];
  totalParts: number;
  started: number;
  finished?: number;
  error: string | null;
};

export type StatusResponse = {
  partsDone: number;
  totalParts: number;
  started: number;
  finished?: number;
  error: string | null;
  originalName: string;
};
