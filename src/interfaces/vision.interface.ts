interface IBlock {
  lines: ILine[];
}

interface ILine {
  text: string;
  boundingPolygon: { x: number; y: number }[];
  words: {
    text: string;
    boundingPolygon: { x: number; y: number }[];
    confidence: number;
  }[];
}

export interface IVision {
  metadata: {
    width: number;
    height: number;
  };

  readResult: {
    blocks: IBlock[];
  };
}
