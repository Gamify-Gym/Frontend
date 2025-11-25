import { View, StyleSheet } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";
import { useMemo } from "react";
import { getRankInfo, calculatePoints } from "@/utils/rankSystem";
import RankBadge from "./RankBadge";

interface FrequencyRankingCardProps {
  player: Player;
  position: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
}

export default function FrequencyRankingCard({ player, position, isCurrentUser, isTopThree }: FrequencyRankingCardProps) {
  const playerRankInfo = useMemo(() => {
    const points = calculatePoints(player);
    return getRankInfo(points, player.weeklyStreak, player.monthlyWorkoutDays || 0, player.dietCompletionRate || 0);
  }, [player]);

  const getRankIcon = () => {
    if (position === 1) return <MaterialDesignIcons name="crown" size={30} color="#FFD700" />;
    if (position === 2) return <MaterialDesignIcons name="medal" size={23} color="#C0C0C0" />;
    if (position === 3) return <MaterialDesignIcons name="medal" size={20} color="#CD7F32" />;
    return null;
  };

  const monthlyDays = player.monthlyWorkoutDays || 0;

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.currentUserCard,
        isTopThree && styles.topThreeCard,
        position === 1 && styles.firstPlaceCard,
      ]}
    >
      <View style={styles.rankBadge}>
        {getRankIcon() || <Text style={styles.rankNumber}>#{position}</Text>}
      </View>

      <View style={styles.content}>
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.playerName,
              isCurrentUser && styles.currentUserName,
              position === 1 && styles.firstPlaceName,
            ]}
          >
            {player.user.username}
            {isCurrentUser && " (Você)"}
          </Text>
          <RankBadge
            rankInfo={playerRankInfo}
            size="small"
            showPoints={false}
            showProgress={false}
          />
        </View>

        <View style={styles.statsRow}>
          <MaterialDesignIcons name="calendar-check" size={14} color="#4caf50" />
          <Text style={styles.statValue}>{monthlyDays} dias este mês</Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min((monthlyDays / 30) * 100, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((monthlyDays / 30) * 100)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "rgba(43, 11, 79, 0.4)",
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  currentUserCard: {
    backgroundColor: "rgba(223, 128, 255, 0.15)",
    borderColor: "rgba(223, 128, 255, 0.6)",
    borderWidth: 2,
  },
  topThreeCard: {
    backgroundColor: "rgba(43, 11, 79, 0.6)",
  },
  firstPlaceCard: {
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    borderColor: "rgba(255, 215, 0, 0.3)",
    borderWidth: 2,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#dfb7ff",
  },
  content: {
    flex: 1,
    gap: 6,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  playerName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  currentUserName: {
    color: "#df80ff",
  },
  firstPlaceName: {
    color: "#FFD700",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 12,
    color: "#dfb7ff",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 5,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    borderRadius: 2.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 2.5,
  },
  progressText: {
    fontSize: 10,
    color: "#dfb7ff",
    fontWeight: "600",
    minWidth: 32,
    textAlign: "right",
  },
});