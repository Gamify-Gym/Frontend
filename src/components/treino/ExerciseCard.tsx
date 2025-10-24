import { Text } from "@/components/general";
import Button from "@/components/general/Button";
import { ExerciseType } from "@/components/general/types";
import colors from "@/components/general/Colors";
import { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

interface ExerciseCardProps {
  exercise: ExerciseType;
  onComplete: (exercise: ExerciseType) => void;
}

export default function ExerciseCard({
  exercise,
  onComplete,
}: ExerciseCardProps) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [now, setNow] = useState<number>(0);
  const [seriesTimes, setSeriesTimes] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number>(0);

  const handleStart = () => {
    const currentTime = Date.now();
    setStartTime(currentTime);
    setNow(currentTime);
    setIsRunning(true);

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const handleCompleteSeries = () => {
    if (startTime === null) return;

    const elapsedTime = (now - startTime) / 1000;
    const newSeriesTimes = [...seriesTimes, elapsedTime];
    setSeriesTimes(newSeriesTimes);

    setStartTime(null);
    setNow(0);
    setIsRunning(false);
    clearInterval(intervalRef.current);

    if (newSeriesTimes.length >= exercise.series) {
      onComplete(exercise);
    }
  };

  const currentTime = startTime !== null ? (now - startTime) / 1000 : 0;
  const isCompleted = seriesTimes.length >= exercise.series;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins}:${secs.toString().padStart(2, "0")}:${ms
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.exerciseCardMain}>
      <View style={styles.cardHeader}>
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        {isCompleted && (
          <Text style={styles.completedBadge}>✓ Completo</Text>
        )}
      </View>

      <View style={styles.exerciseInfo}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Repetições</Text>
          <Text style={styles.infoValue}>{exercise.repeticoes}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Séries</Text>
          <Text style={styles.infoValue}>{exercise.series}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Série Atual</Text>
          <Text style={styles.infoValue}>
            {seriesTimes.length + 1}/{exercise.series}
          </Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>Tempo</Text>
        <Text style={styles.timerValue}>{formatTime(currentTime)}</Text>
      </View>

      {seriesTimes.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Tempos registrados:</Text>
          {seriesTimes.map((time, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyLabel}>Série {index + 1}</Text>
              <Text style={styles.historyValue}>{formatTime(time)}</Text>
            </View>
          ))}
        </View>
      )}

      {!isCompleted && (
        <View style={styles.buttonContainer}>
          {!isRunning && startTime === null && (
            <Button
              height={50}
              label="Iniciar"
              onClick={handleStart}
              icon="play"
            />
          )}
          {isRunning && (
            <Button
              height={50}
              label="Parar"
              onClick={handleStop}
              icon="pause"
            />
          )}
          {!isRunning && startTime !== null && (
            <Button
              height={50}
              label="Completar Série"
              onClick={handleCompleteSeries}
              icon="check"
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  exerciseCardMain: {
    backgroundColor: colors.brightPurple,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.white,
    flex: 1,
  },
  completedBadge: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.success,
    backgroundColor: `${colors.success}22`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseInfo: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: colors.darkPurple,
    borderRadius: 12,
    padding: 12,
  },
  infoItem: {
    alignItems: "center",
    gap: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.secondaryLightGray,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.pink,
  },
  timerContainer: {
    alignItems: "center",
    backgroundColor: colors.darkPurple,
    borderRadius: 12,
    padding: 16,
  },
  timerLabel: {
    fontSize: 14,
    color: colors.secondaryLightGray,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.pink,
    fontVariant: ["tabular-nums"],
  },
  historyContainer: {
    backgroundColor: colors.darkPurple,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.white,
    marginBottom: 4,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  historyLabel: {
    fontSize: 14,
    color: colors.secondaryLightGray,
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.pink,
    fontVariant: ["tabular-nums"],
  },
  buttonContainer: {
    width: "100%",
  },
});
