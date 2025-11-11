import { View, StyleSheet, ScrollView, Modal, TouchableOpacity } from "react-native";
import { useAuth } from "@/context/authContext";
import ParentView from "@/components/general/ParentView";
import { Player, PlayerActivity, TreinoType } from "@/components/general/types";
import { getMockWorkouts, getMockFriends } from "@/utils/mockData";
import { useEffect, useMemo, useState } from "react";
import { Text } from "@/components/general";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import RankingPodium from "@/components/ranking/RankingPodium";
import RankingTabs from "@/components/ranking/RankingTabs";

export default function Home() {
  const { user, setUser } = useAuth();
  const [showFullRanking, setShowFullRanking] = useState(false);

  useEffect(() => {
    const workouts: TreinoType[] = getMockWorkouts();

    const mockUser: Player = {
      id_player: 1,
      height: 178,
      weight: 85,
      weeklyTargetDays: 4,
      weeklyStreak: 2,
      lastWeekOfYear: 43,
      currentWeekTrainedDays: 2,
      monthlyWorkoutDays: 12, // total de dias treinados no mês
      dietCompletionRate: 75,
      totalDietDaysCompleted: 30,
      lastPositionChange: 0,
      competitionLifts: {
        benchPress: 80,
        squat: 110,
        deadlift: 130,
      },
      workouts: workouts,
      user: {
        id_user: 1,
        username: "Lucas Silva",
        password: "senha",
        email: "lucas.silva@email.com",
      },
      activities: [],
    };

    const active: PlayerActivity[] = [
      {
        id_playerActivity: 1,
        activeDate: "2025-10-20",
        status: "OK" as any,
        player: mockUser,
        workout: workouts[1],
      },
      {
        id_playerActivity: 2,
        activeDate: "2025-10-22",
        status: "OK" as any,
        player: mockUser,
        workout: workouts[2],
      },
      {
        id_playerActivity: 3,
        activeDate: "2025-10-24",
        status: "SKIP" as any,
        player: mockUser,
        workout: null,
      },
      {
        id_playerActivity: 4,
        activeDate: "2025-10-25",
        status: "OK" as any,
        player: mockUser,
        workout: workouts[0],
      },
      {
        id_playerActivity: 5,
        activeDate: "2025-10-26",
        status: "SKIP" as any,
        player: mockUser,
        workout: null,
      },
    ];

    mockUser.activities = active;
    setUser(mockUser);
  }, []);

  const friends = useMemo(() => getMockFriends(), []);

  const leaderboard = useMemo(() => {
    const allPlayers = user ? [user, ...friends] : friends;
    return allPlayers.sort((a, b) => b.weeklyStreak - a.weeklyStreak);
  }, [friends, user]);


  const topThree = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday

  const getWeekActivities = () => {
    if (!user?.activities) return Array(7).fill(null);

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - currentDayOfWeek);

    return weekDays.map((_, index) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + index);
      const dateString = dayDate.toISOString().split("T")[0];

      const activity = user.activities.find((a) => a.activeDate === dateString);

      if (index > currentDayOfWeek) return null; // Future days
      if (activity?.status === "OK") return "completed";
      if (activity?.status === "SKIP") return "skipped";
      return "missed";
    });
  };

  const weekActivities = getWeekActivities();

  if (!user) {
    return (
      <ParentView>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </ParentView>
    );
  }

  return (
    <ParentView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, {user.user.username}! 👋</Text>
          <Text style={styles.subGreeting}>Continue sua jornada</Text>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <MaterialDesignIcons name="fire" size={32} color="#ff6b9d" />
            <Text style={styles.statValue}>{user.weeklyStreak}</Text>
            <Text style={styles.statLabel}>Semanas de Streak</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialDesignIcons name="dumbbell" size={32} color="#df80ff" />
            <Text style={styles.statValue}>
              {user.currentWeekTrainedDays}/{user.weeklyTargetDays}
            </Text>
            <Text style={styles.statLabel}>Treinos Esta Semana</Text>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.cardHeader}>
            <MaterialDesignIcons
              name="calendar-week"
              size={24}
              color="#df80ff"
            />
            <Text style={styles.cardTitle}>Semana Atual</Text>
          </View>
          <View style={styles.weekGrid}>
            {weekDays.map((day, index) => {
              const status = weekActivities[index];
              return (
                <View key={index} style={styles.dayContainer}>
                  <Text style={styles.dayLabel}>{day}</Text>
                  <View
                    style={[
                      styles.dayCircle,
                      status === "completed" && styles.dayCompleted,
                      status === "skipped" && styles.daySkipped,
                      status === "missed" && styles.dayMissed,
                      status === null && styles.dayFuture,
                    ]}
                  >
                    {status === "completed" && (
                      <MaterialDesignIcons
                        name="check"
                        size={18}
                        color="#ffffff"
                      />
                    )}
                    {status === "skipped" && (
                      <MaterialDesignIcons
                        name="close"
                        size={18}
                        color="#ffffff"
                      />
                    )}
                    {status === "missed" && (
                      <MaterialDesignIcons
                        name="minus"
                        size={18}
                        color="#ffffff"
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <RankingPodium
          topThree={topThree}
          currentUserId={user.id_player}
          onViewAll={() => setShowFullRanking(true)}
        />
      </ScrollView>

    
<Modal
  visible={showFullRanking}
  animationType="slide"
  presentationStyle="pageSheet"
  onRequestClose={() => setShowFullRanking(false)}
>
  <View style={styles.modalContainer}>
    <TouchableOpacity
      onPress={() => setShowFullRanking(false)}
      style={styles.closeButton}
    >
      <MaterialDesignIcons name="close" size={28} color="#ffffff" />
    </TouchableOpacity>
    <RankingTabs players={leaderboard} currentUserId={user.id_player} />
  </View>
</Modal>
    </ParentView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b1031",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 18,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: "#dfb7ff",
  },
  statsCard: {
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 4,
  },
  statItem: {
    alignItems: "center",
    gap: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    fontSize: 12,
    color: "#dfb7ff",
    textAlign: "center",
  },
  statDivider: {
    width: 2,
    backgroundColor: "rgba(223, 128, 255, 0.3)",
  },
  calendarCard: {
    backgroundColor: "rgba(27, 16, 49, 0.6)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(223, 128, 255, 0.3)",
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  weekGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayContainer: {
    alignItems: "center",
    gap: 8,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#dfb7ff",
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(43, 11, 79, 0.5)",
    borderWidth: 2,
    borderColor: "rgba(223, 128, 255, 0.2)",
  },
  dayCompleted: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },
  daySkipped: {
    backgroundColor: "#ff6b9d",
    borderColor: "#ff6b9d",
  },
  dayMissed: {
    backgroundColor: "rgba(255, 107, 157, 0.3)",
    borderColor: "rgba(255, 107, 157, 0.5)",
  },
  dayFuture: {
    backgroundColor: "rgba(43, 11, 79, 0.3)",
    borderColor: "rgba(223, 128, 255, 0.1)",
  },
  modalContainer: {
   flex: 1,
  backgroundColor: "#1b1031",
  paddingTop: 30,
  paddingBottom: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  closeButton: {
  position: "absolute",
  top: 60,
  right: 20,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "rgba(223, 128, 255, 0.2)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},
});