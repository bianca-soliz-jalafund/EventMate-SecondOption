import GridContainer from "@/components/GridContainer";
import { useState } from "react";
import type Event from "@lib/models/Event";
import { useAuth } from "@/contexts/auth/AuthContext";

const EventsMainPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GridContainer
          className="mb-8"
          events={events}
          setEvents={setEvents}
          filterOptions={{
            invitedToMeEmail: user?.email ?? undefined,
          }}
        />
      </div>
    </>
  );
};

export default EventsMainPage;
