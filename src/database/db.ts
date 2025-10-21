import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { createDatabase } from '@/database/schema';

export function useDatabase (){
    const [db, setDb] = useState(null);
    const [dbInitialized, setDbInitialized] = useState(false);

    useEffect(() => {
        const openDb= async () => {
        try{ 
            const database = await SQLite.openDatabaseAsync('gamify-gym.db');
            setDb(database);
         } catch {

         }
     }
    })
}
