import { DietaType } from "@/components/general/types";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { getMockDiets } from "@/utils/mockData";

export function useDieta() {
  const [dieta, setDieta] = useState<[DietaType] | []>([]);
  const [rerun, setRerun] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // MOCK: Using mock data instead of API call
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const mockData = getMockDiets();
        setDieta(mockData as any);
      } catch (error: any) {
        console.error(error);
      }
    };
    fetchData();
  }, [rerun]);

  const handleRerun = () => {
    setRerun(!rerun);
  };
  return { dieta, setDieta, handleRerun };
}
