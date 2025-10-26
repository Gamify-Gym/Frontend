import { TreinoType } from "@/components/general/types";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { getMockWorkouts } from "@/utils/mockData";

export function useWorkout() {
  const [treino, setTreino] = useState<[TreinoType] | []>([]);
  const [rerun, setRerun] = useState<number>(0);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MOCK: Using mock data instead of API call
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const mockData = getMockWorkouts();
        setTreino(mockData as any);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [rerun]);

  return { treino, setTreino, setRerun };
}
