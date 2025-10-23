import { ExerciseType } from "@/components/general/types";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

export function useExercise() {
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [rerun, setRerun] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/exercise`,
          { headers: { Authorization: `Bearer ${token}` }, method: "GET" }
        );

        if (!res.ok) {
          const errorText = await res.text();
          setExercise(null);
          throw new Error(errorText);
        }

        const json = await res.json();
        setExercise(json);
      } catch (error: any) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, [rerun]);

  const handleRerun = () => {
    setRerun(!rerun);
  };

  return { exercise, setExercise, handleRerun };
}
