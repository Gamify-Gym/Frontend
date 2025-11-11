export type ExerciseType = {
  id: number;
  name: string;
  muscles: string;
  repeticoes: number;
  series: number;
  complete?: boolean;
};

export interface CompetitionLifts {
  benchPress: number;
  squat: number;
  deadlift: number;
}

export interface TreinoType {
  id: number;
  name: string;
  description: string;
  exercises: ExerciseType[];
  complete?: boolean;
  totalExercises: number;
  totalSeries: number;
}
export interface User {
  id_user: number;
  username: string;
  email: string;
  password: string;
}

export interface Player {
  id_player: number;
  height: number | null;
  weight: number | null;
  weeklyTargetDays: number;
  weeklyStreak: number;
  lastWeekOfYear: number;
  currentWeekTrainedDays: number;
  workouts: TreinoType[];
  user: User;
  activities: PlayerActivity[];
    dietCompletionRate?: number;
  totalDietDaysCompleted?: number;
  lastPositionChange?: number;
  competitionLifts?: CompetitionLifts;
   monthlyWorkoutDays?: number;  
  
}

enum PlayerActivityStatus {
  OK = "OK",
  BROKEN = "BROKEN",
  SKIP = "SKIP",
}

export interface PlayerActivity {
  id_playerActivity: number;
  activeDate: string;
  status: PlayerActivityStatus;
  player: Player;
  workout: TreinoType | null;
}

export interface Acucars {
  id: number;
  acucarTotal: number;
  acucarAdicionado: number;
}

export interface Gorduras {
  id: number;
  gorduraTrans: number;
  gordurasMonosaturadas: number;
  gordurasPoliinsaturadas: number;
  gordurasSaturadas: number;
}

export interface Alimento {
  id: number;
  name: string;
  calories: number;
  fats: number;
  carbs: number;
  fibers: number;
  sodium: number;
  proteins: number;
  acucars?: Acucars;
  gorduras?: Gorduras;
  dieta?: DietaType;
}

export interface DietaType {
  id: number;
  name: string;
  alimentos: Alimento[];
}

export interface AlimentoLogs {
  id: number;
  quandoComido: string;
  alimento: Alimento;
}

export interface AlimentoDto {
  nome: string;
  calories: number;
  fats: number;
  carbs: number;
  fibers: number;
  sodium: number;
  proteins: number;
  acucarTotal: number;
  acucarAdicionado: number;
  gorduraTrans: number;
  gordurasMonosaturadas: number;
  gordurasPoliinsaturadas: number;
  gordurasSaturadas: number;
  idDieta: number;
}
