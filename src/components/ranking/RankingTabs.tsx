import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Player } from "@/components/general/types";
import { useMemo, useState } from "react";
import StreakRankingCard from "./StreakRankingCard";
import FrequencyRankingCard from "./FrequencyRankingCard";
import DietRankingCard from "./DietRankingCard";
import LiftRankingCard from "./LiftRankingCard";

type RankingType = "streak" | "frequency" | "diet" | "lifts";

interface RankingTabsProps {
  players: Player[];
  currentUserId: number;
}

export default function RankingTabs({ players, currentUserId }: RankingTabsProps) {
  const [activeTab, setActiveTab] = useState<RankingType>("streak");

  const sortedPlayers = useMemo(() => {
    const sorted = [...players];
    
    switch (activeTab) {
      case "streak":
        return sorted.sort((a, b) => b.weeklyStreak - a.weeklyStreak);
      
      case "frequency":
        return sorted.sort((a, b) => 
          (b.monthlyWorkoutDays || 0) - (a.monthlyWorkoutDays || 0)
        );
      
      case "diet":
        return sorted.sort((a, b) => 
          (b.dietCompletionRate || 0) - (a.dietCompletionRate || 0)
        );
      
      case "lifts":
        return sorted.sort((a, b) => {
          const totalA = (a.competitionLifts?.benchPress || 0) + 
                        (a.competitionLifts?.squat || 0) + 
                        (a.competitionLifts?.deadlift || 0);
          const totalB = (b.competitionLifts?.benchPress || 0) + 
                        (b.competitionLifts?.squat || 0) + 
                        (b.competitionLifts?.deadlift || 0);
          return totalB - totalA;
        });
      
      default:
        return sorted;
    }
  }, [players, activeTab]);

  const currentUserPosition = useMemo(() => {
    return sortedPlayers.findIndex(p => p.id_player === currentUserId) + 1;
  }, [sortedPlayers, currentUserId]);

  const tabs = [
    { id: "streak" as RankingType, label: "Streak", icon: "fire" },
    { id: "frequency" as RankingType, label: "Frequência", icon: "calendar-month" },
    { id: "diet" as RankingType, label: "Dieta", icon: "food-apple" },
    { id: "lifts" as RankingType, label: "Cargas", icon: "weight-lifter" },
  ];

  const renderCard = (player: Player, index: number) => {
    const position = index + 1;
    const isCurrentUser = player.id_player === currentUserId;
    const isTopThree = position <= 3;

    switch (activeTab) {
      case "streak":
        return (
          <StreakRankingCard
            key={player.id_player}
            player={player}
            position={position}
            isCurrentUser={isCurrentUser}
            isTopThree={isTopThree}
          />
        );
      
      case "frequency":
        return (
          <FrequencyRankingCard
            key={player.id_player}
            player={player}
            position={position}
            isCurrentUser={isCurrentUser}
            isTopThree={isTopThree}
          />
        );
      
      case "diet":
        return (
          <DietRankingCard
            key={player.id_player}
            player={player}
            position={position}
            isCurrentUser={isCurrentUser}
            isTopThree={isTopThree}
          />
        );
      
      case "lifts":
        return (
          <LiftRankingCard
            key={player.id_player}
            player={player}
            position={position}
            isCurrentUser={isCurrentUser}
            isTopThree={isTopThree}
          />
        );
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
  
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <MaterialDesignIcons name="trophy" size={24} color="#ffa64d" />
          <Text style={styles.title}>Ranking Completo</Text>
        </View>
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>Você está em #{currentUserPosition}</Text>
        </View>
      </View>

     
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
        style={styles.tabsScroll}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <MaterialDesignIcons
              name={tab.icon}
              size={18}
              color={activeTab === tab.id ? "#ffffff" : "#dfb7ff"}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.rankingList}>
        {sortedPlayers.map((player, index) => renderCard(player, index))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(27, 16, 49, 0.6)",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    gap: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  positionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(223, 128, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  positionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#df80ff",
  },
  tabsScroll: {
    marginBottom: 16,
  },
  tabsContainer: {
    gap: 8,
    paddingRight: 16,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "rgba(43, 11, 79, 0.4)",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  activeTab: {
    backgroundColor: "rgba(223, 128, 255, 0.3)",
    borderColor: "rgba(223, 128, 255, 0.5)",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#dfb7ff",
  },
  activeTabText: {
    color: "#ffffff",
  },
  rankingList: {
    gap: 10,
  },
});