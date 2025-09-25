export type ExerciseType = {
  id: number;
  name: string;
  muscles: string;
  repeticoes: number;
  series: number;
  complete?: boolean;
};

export type TreinoType = {
  id: number;
  name: string;
  description: string;
  exercises: ExerciseType[];
  complete?: boolean;
  totalExercises: number;
  totalSeries: number;
};
