import { TreinoType } from "@/components/general/types";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

export function useWorkout() {
  const [treino, setTreino] = useState<[TreinoType] | []>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/training/workout`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token?.replace(/"/g, "")}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Request failed", res.status);
          const errorText = await res.text();
          setTreino([]);
          throw new Error(errorText);
        }

        const json = await res.json();
        setTreino(json);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [token]);

  return { treino, setTreino };
}
