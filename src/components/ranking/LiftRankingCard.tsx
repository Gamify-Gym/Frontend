import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";
import { useState } from "react";

interface LiftRankingCardProps {
  player: Player;
  position: number;
  isCurrentUser: boolean;
  isTopThree: boolean;
}

export default function LiftRankingCard({ player, position, isCurrentUser, isTopThree }: LiftRankingCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getRankIcon = () => {
    if (position === 1) return <MaterialDesignIcons name="crown" size={34} color="#FFD700" />;
    if (position === 2) return <MaterialDesignIcons name="medal" size={30} color="#C0C0C0" />;
    if (position === 3) return <MaterialDesignIcons name="medal" size={24} color="#CD7F32" />;
    return null;
  };

  const totalLifted = 
    (player.competitionLifts?.benchPress || 0) +
    (player.competitionLifts?.squat || 0) +
    (player.competitionLifts?.deadlift || 0);

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
        <View style={styles.nameRow}>
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
        </View>

       
        <TouchableOpacity 
          style={styles.expandContainer}
          onPress={() => setExpanded(!expanded)}
          activeOpacity={0.7}
        >
          <Text style={styles.expandHint}>
            {expanded ? "Ocultar cargas" : "Ver cargas"}
          </Text>
          <View style={styles.expandButton}>
            <MaterialDesignIcons 
              name={expanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#dfb7ff" 
            />
          </View>
        </TouchableOpacity>


        {expanded && (
          <View style={styles.detailsContainer}>
            <View style={styles.liftRow}>
              <View style={styles.liftIconContainer}>
                <MaterialDesignIcons name="dumbbell" size={16} color="#df80ff" />
              </View>
              <Text style={styles.liftLabel}>Supino</Text>
              <Text style={styles.liftValue}>{player.competitionLifts?.benchPress || 0}kg</Text>
            </View>

            <View style={styles.liftRow}>
              <View style={styles.liftIconContainer}>
                <MaterialDesignIcons name="weight-lifter" size={16} color="#ff6b9d" />
              </View>
              <Text style={styles.liftLabel}>Agachamento</Text>
              <Text style={styles.liftValue}>{player.competitionLifts?.squat || 0}kg</Text>
            </View>

            <View style={styles.liftRow}>
              <View style={styles.liftIconContainer}>
                <MaterialDesignIcons name="format-align-bottom" size={16} color="#ffa64d" />
              </View>
              <Text style={styles.liftLabel}>Terra</Text>
              <Text style={styles.liftValue}>{player.competitionLifts?.deadlift || 0}kg</Text>
            </View>
          </View>
        )}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "100%" }]} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    backgroundColor: "rgba(43, 11, 79, 0.4)",
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#dfb7ff",
  },
  content: {
    flex: 1,
    gap: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  playerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
  },
  currentUserName: {
    color: "#df80ff",
  },
  firstPlaceName: {
    color: "#FFD700",
  },
  expandContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  expandHint: {
    fontSize: 13,
    color: "#dfb7ff",
  },
  expandButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  detailsContainer: {
    gap: 10,
    paddingTop: 4,
  },
  liftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(27, 16, 49, 0.5)",
    padding: 12,
    borderRadius: 10,
  },
  liftIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  liftLabel: {
    flex: 1,
    fontSize: 14,
    color: "#dfb7ff",
  },
  liftValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
  },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(223, 128, 255, 0.2)",
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#dfb7ff",
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#df80ff",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  progressBar: {
    flex: 1,
    height: 0,
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#df80ff",
    borderRadius: 3,
  },
});