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
  originalname: string;
  result: Part[];
  totalParts: number;
  started: number;
  finished?: number;
  error: string | null;
  partLength: number;
};

export type StatusResponse = {
  partsDone: number;
  totalParts: number;
  started: number;
  finished?: number;
  error: string | null;
  originalname: string;
};
