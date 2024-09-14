import { createClient } from '@supabase/supabase-js';
import React, { useEffect, useState, useMemo } from 'react';

// Supabase client credentials
const client = "https://nhdfdslcxbuavfltkszb.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oZGZkc2xjeGJ1YXZmbHRrc3piIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNjIyOTc0MiwiZXhwIjoyMDQxODA1NzQyfQ.garIpYZTgRHdle6JoCCvsfBgSuoY34tGBI4txdl48C8";

export default function FollowRacePage() {
  // Initialize Supabase client with useMemo to avoid re-creation
  const supabase = useMemo(() => createClient(client, key), []);

  const [hamiltonPos, setHamiltonPos] = useState(0);
  const [eventType, setEventType] = useState('');
  const [isWinning, setIsWinning] = useState(true);

  useEffect(() => {
    const channel = supabase.channel("tronco")
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'race_b_event'
      }, ({ new: event }) => {
        const { event_type, hamilton_pos } = event;
        // Update state with the new event data
        setEventType(event_type);
        setHamiltonPos(hamilton_pos);
        setIsWinning(hamilton_pos === 1);
      }).subscribe();

    // Clean up the subscription
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  return (
    <div>
      {(eventType === "race.start" || eventType === "race.change") ? (
        <div>
          {hamiltonPos === 1 ? (
            
            <div  style={{
              border: '1px solid #ccc', 
              padding: '20px', 
              borderRadius: '8px', 
              width: '200px', 
              textAlign: 'center', 
              cursor: 'pointer'
            }}>
              <h2>
                You are wining
              </h2>
              Hamilton is in 1st place.
            </div>

          ) : (
            <div style={{
              border: '1px solid #ccc', 
              padding: '20px', 
              borderRadius: '8px', 
              width: '200px', 
              textAlign: 'center', 
              cursor: 'pointer'
            }}>
              <h2>
              You are losing
              </h2>
              Hamilton is in {hamiltonPos} place.
            </div>
          )}
        </div>
      ) : (
        <div  style={{
          border: '1px solid #ccc', 
          padding: '20px', 
          borderRadius: '8px', 
          width: '200px', 
          textAlign: 'center', 
          cursor: 'pointer'
        }}>
          Bet for the next race 
        </div>
      )}
    </div>
  );
}
