import { DietaType } from "@/components/general/types";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";

export function useDieta() {
  const [dieta, setDieta] = useState<[DietaType] | []>([]);
  const [rerun, setRerun] = useState<boolean>(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_URL}/dieta/plan`,
          { headers: { Authorization: `Bearer ${token}` }, method: "GET" }
        );

        if (!res.ok) {
          const errorText = await res.text();
          setDieta([]);
          throw new Error(errorText);
        }

        const json = await res.json();
        setDieta(json);
      } catch (error: any) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, [rerun]);

  const handleRerun = () => {
    setRerun(!rerun);
  };
  return { dieta, setDieta, handleRerun };
}
