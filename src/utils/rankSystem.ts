import { Player } from "@/components/general/types";

export interface RankInfo {
  tier: 'rato' | 'raposa' | 'leopardo' | 'ursoPolar' | 'rinoceronte' | 'elefante' | 'mamute' | 'dragao' | 'canguru';
  level: 1 | 2 | 3;
  levelName: '1' | '2' | 'Mestre' | 'Imortal' | 'Cósmico' | 'Infinito';
  fullName: string;
  totalPoints: number;
  colors: string[];
  borderColor: string;
  nextRankName?: string;
  pointsToNext?: number;
}

const rankColors = {
  rato: { colors: ['#4a4a4a', '#2c2c2c'], border: '#4a4a4a' },
  raposa: { colors: ['#ff6b35', '#ff8c42'], border: '#ff6b35' },
  leopardo: { colors: ['#f5bd155a', '#f7b831ff'], border: '#f7b831ff' },
  ursoPolar: { colors: ['#e8f4f8', '#a8d5e2'], border: '#a8d5e2' },
  rinoceronte: { colors: ['#8b9aad', '#6c7a89'], border: '#8b9aad' },
  elefante: { colors: ['#6c7a89', '#4a5568'], border: '#6c7a89' },
  mamute: { colors: ['#8b5a3c', '#6d4c3d'], border: '#8b5a3c' },
  dragao: { colors: ['#9b59b6', '#8e44ad'], border: '#9b59b6' },
  canguru: { colors: ['#ffd700', '#ffed4e', '#ffd700'], border: '#ffd700' },
};

/**
 * Calcula pontos de Streak (35% do total - max 150pts)
 */
function calculateStreakPoints(weeklyStreak: number): number {
  if (weeklyStreak >= 30) return 150;
  if (weeklyStreak >= 15) return 100;
  if (weeklyStreak >= 8) return 60;
  if (weeklyStreak >= 4) return 30;
  if (weeklyStreak >= 1) return 10;
  return 0;
}

/**
 * Calcula pontos de Frequência Mensal (35% do total - max 150pts)
 */
function calculateFrequencyPoints(monthlyDays: number): number {
  if (monthlyDays >= 21) return 150;
  if (monthlyDays >= 16) return 100;
  if (monthlyDays >= 11) return 60;
  if (monthlyDays >= 6) return 30;
  if (monthlyDays >= 1) return 10;
  return 0;
}

/**
 * Calcula pontos de Dieta (30% do total - max 150pts)
 */
function calculateDietPoints(dietRate: number): number {
  if (dietRate >= 91) return 150;
  if (dietRate >= 76) return 100;
  if (dietRate >= 61) return 60;
  if (dietRate >= 41) return 30;
  if (dietRate >= 1) return 10;
  return 0;
}

/**
 * Calcula o multiplicador baseado no streak
 */
export function calculateMultiplier(weeklyStreak: number): number {
  if (weeklyStreak >= 100) return 2.0;
  if (weeklyStreak >= 60) return 1.5;
  if (weeklyStreak >= 30) return 1.2;
  return 1.0;
}

/**
 * Calcula pontos totais do jogador
 */
export function calculatePoints(player: Player): number {
  const streakPoints = calculateStreakPoints(player.weeklyStreak);
  const frequencyPoints = calculateFrequencyPoints(player.monthlyWorkoutDays || 0);
  const dietPoints = calculateDietPoints(player.dietCompletionRate || 0);

  const basePoints = streakPoints + frequencyPoints + dietPoints;
  const multiplier = calculateMultiplier(player.weeklyStreak);

  return Math.floor(basePoints * multiplier);
}

/**
 * Verifica se atende aos requisitos especiais do Canguru
 */
function meetsKangarooRequirements(
  totalPoints: number,
  weeklyStreak: number,
  monthlyDays: number,
  dietRate: number,
  level: 'Imortal' | 'Cósmico' | 'Infinito'
): boolean {
  if (level === 'Imortal') {
    return totalPoints >= 451 && weeklyStreak >= 30 && monthlyDays >= 25 && dietRate >= 95;
  }
  if (level === 'Cósmico') {
    return totalPoints >= 601 && weeklyStreak >= 60 && monthlyDays >= 25;
  }
  if (level === 'Infinito') {
    return totalPoints >= 751 && weeklyStreak >= 100 && monthlyDays >= 25 && dietRate >= 98;
  }
  return false;
}

/**
 * Obtém informações do rank baseado nos pontos totais
 */
export function getRankInfo(
  totalPoints: number,
  weeklyStreak: number,
  monthlyDays: number,
  dietRate: number
): RankInfo {
  let tier: RankInfo['tier'];
  let level: RankInfo['level'];
  let levelName: RankInfo['levelName'];
  let nextRankName: string | undefined;
  let pointsToNext: number | undefined;

  // CANGURU (451-900) - Requer multiplicador + requisitos especiais
  if (totalPoints >= 751 && meetsKangarooRequirements(totalPoints, weeklyStreak, monthlyDays, dietRate, 'Infinito')) {
    tier = 'canguru';
    level = 3;
    levelName = 'Infinito';
    nextRankName = undefined;
    pointsToNext = undefined;
  } else if (totalPoints >= 601 && meetsKangarooRequirements(totalPoints, weeklyStreak, monthlyDays, dietRate, 'Cósmico')) {
    tier = 'canguru';
    level = 2;
    levelName = 'Cósmico';
    nextRankName = 'Canguru Infinito';
    pointsToNext = 751 - totalPoints;
  } else if (totalPoints >= 451 && meetsKangarooRequirements(totalPoints, weeklyStreak, monthlyDays, dietRate, 'Imortal')) {
    tier = 'canguru';
    level = 1;
    levelName = 'Imortal';
    nextRankName = 'Canguru Cósmico';
    pointsToNext = 601 - totalPoints;
  }
  // DRAGÃO (351-450)
  else if (totalPoints >= 417) {
    tier = 'dragao';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Canguru Imortal';
    pointsToNext = 451 - totalPoints;
  } else if (totalPoints >= 384) {
    tier = 'dragao';
    level = 2;
    levelName = '2';
    nextRankName = 'Dragão Mestre';
    pointsToNext = 417 - totalPoints;
  } else if (totalPoints >= 351) {
    tier = 'dragao';
    level = 1;
    levelName = '1';
    nextRankName = 'Dragão 2';
    pointsToNext = 384 - totalPoints;
  }
  // MAMUTE (301-350)
  else if (totalPoints >= 335) {
    tier = 'mamute';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Dragão 1';
    pointsToNext = 351 - totalPoints;
  } else if (totalPoints >= 318) {
    tier = 'mamute';
    level = 2;
    levelName = '2';
    nextRankName = 'Mamute Mestre';
    pointsToNext = 335 - totalPoints;
  } else if (totalPoints >= 301) {
    tier = 'mamute';
    level = 1;
    levelName = '1';
    nextRankName = 'Mamute 2';
    pointsToNext = 318 - totalPoints;
  }
  // ELEFANTE (251-300)
  else if (totalPoints >= 285) {
    tier = 'elefante';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Mamute 1';
    pointsToNext = 301 - totalPoints;
  } else if (totalPoints >= 268) {
    tier = 'elefante';
    level = 2;
    levelName = '2';
    nextRankName = 'Elefante Mestre';
    pointsToNext = 285 - totalPoints;
  } else if (totalPoints >= 251) {
    tier = 'elefante';
    level = 1;
    levelName = '1';
    nextRankName = 'Elefante 2';
    pointsToNext = 268 - totalPoints;
  }
  // RINOCERONTE (201-250)
  else if (totalPoints >= 235) {
    tier = 'rinoceronte';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Elefante 1';
    pointsToNext = 251 - totalPoints;
  } else if (totalPoints >= 218) {
    tier = 'rinoceronte';
    level = 2;
    levelName = '2';
    nextRankName = 'Rinoceronte Mestre';
    pointsToNext = 235 - totalPoints;
  } else if (totalPoints >= 201) {
    tier = 'rinoceronte';
    level = 1;
    levelName = '1';
    nextRankName = 'Rinoceronte 2';
    pointsToNext = 218 - totalPoints;
  }
  // URSO POLAR (151-200)
  else if (totalPoints >= 185) {
    tier = 'ursoPolar';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Rinoceronte 1';
    pointsToNext = 201 - totalPoints;
  } else if (totalPoints >= 168) {
    tier = 'ursoPolar';
    level = 2;
    levelName = '2';
    nextRankName = 'Urso Polar Mestre';
    pointsToNext = 185 - totalPoints;
  } else if (totalPoints >= 151) {
    tier = 'ursoPolar';
    level = 1;
    levelName = '1';
    nextRankName = 'Urso Polar 2';
    pointsToNext = 168 - totalPoints;
  }
  // LEOPARDO (101-150)
  else if (totalPoints >= 135) {
    tier = 'leopardo';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Urso Polar 1';
    pointsToNext = 151 - totalPoints;
  } else if (totalPoints >= 118) {
    tier = 'leopardo';
    level = 2;
    levelName = '2';
    nextRankName = 'Leopardo Mestre';
    pointsToNext = 135 - totalPoints;
  } else if (totalPoints >= 101) {
    tier = 'leopardo';
    level = 1;
    levelName = '1';
    nextRankName = 'Leopardo 2';
    pointsToNext = 118 - totalPoints;
  }
  // RAPOSA (51-100)
  else if (totalPoints >= 85) {
    tier = 'raposa';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Leopardo 1';
    pointsToNext = 101 - totalPoints;
  } else if (totalPoints >= 68) {
    tier = 'raposa';
    level = 2;
    levelName = '2';
    nextRankName = 'Raposa Mestre';
    pointsToNext = 85 - totalPoints;
  } else if (totalPoints >= 51) {
    tier = 'raposa';
    level = 1;
    levelName = '1';
    nextRankName = 'Raposa 2';
    pointsToNext = 68 - totalPoints;
  }
  // RATO (0-50)
  else if (totalPoints >= 34) {
    tier = 'rato';
    level = 3;
    levelName = 'Mestre';
    nextRankName = 'Raposa 1';
    pointsToNext = 51 - totalPoints;
  } else if (totalPoints >= 17) {
    tier = 'rato';
    level = 2;
    levelName = '2';
    nextRankName = 'Rato Mestre';
    pointsToNext = 34 - totalPoints;
  } else {
    tier = 'rato';
    level = 1;
    levelName = '1';
    nextRankName = 'Rato 2';
    pointsToNext = 17 - totalPoints;
  }

  // Monta o nome completo
  const tierNames = {
    rato: 'Rato',
    raposa: 'Raposa',
    leopardo: 'Leopardo',
    ursoPolar: 'Urso Polar',
    rinoceronte: 'Rinoceronte',
    elefante: 'Elefante',
    mamute: 'Mamute',
    dragao: 'Dragão',
    canguru: 'Canguru',
  };

  const fullName = `${tierNames[tier]} ${levelName}`;

  return {
    tier,
    level,
    levelName,
    fullName,
    totalPoints,
    colors: rankColors[tier].colors,
    borderColor: rankColors[tier].border,
    nextRankName,
    pointsToNext,
  };
}
