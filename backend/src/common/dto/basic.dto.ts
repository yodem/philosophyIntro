export class CreateBasicDto {
  title: string;
  content: string;
  relatedPhilosophers?: number[];
  relatedQuestions?: number[];
  relatedTerms?: number[];
}

export class UpdateBasicDto extends CreateBasicDto {
  id: number;
}
