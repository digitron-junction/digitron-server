export interface IImageAiMetadataEntity {
  labels: Array<IImageAiLabelEntity>;
}

export interface IImageAiLabelEntity {
  description: string;
  score: number;
}
