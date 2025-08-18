import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  type Dispatch,
} from "react";
import { Loader2, AlertCircle, Calendar } from "lucide-react";
import { QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import Event from "@lib/models/Event";
import EventCard from "./events/EventCard";
import { eventRepository } from "@lib/repositories/implementations/EventRepository";
import type { PaginatedEvents } from "@lib/repositories/interfaces/i_event_repository";

interface GridContainerProps {
  setEvents: Dispatch<React.SetStateAction<Event[]>>;
  events: Event[];
  onEventEdit?: (event: Event) => void;
  onEventRemove?: (event: Event) => void;
  onInviteEvent?: (event: Event) => void;
  className?: string;
  gridTypeVisualization?: "admin" | "public";
  filterOptions?: {
    ownerId?: string;
    invitedToMeEmail?: string;
  };
}

const GridContainer: React.FC<GridContainerProps> = ({
  onEventEdit,
  onEventRemove,
  className = "",
  setEvents,
  onInviteEvent,
  events,
  gridTypeVisualization = "public",
  filterOptions,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 9;

  const loadInitialEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result: PaginatedEvents =
        await eventRepository.getEventsWithFilters(filterOptions, PAGE_SIZE);

      setEvents(result.events);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading initial events:", error);
      setError("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [setEvents]);

  // Load more events
  const loadMoreEvents = useCallback(async () => {
    if (!hasMore || isLoadingMore || !lastDoc) return;

    try {
      setIsLoadingMore(true);
      setError(null);

      const result: PaginatedEvents =
        await eventRepository.getEventsWithFilters(
          filterOptions,
          PAGE_SIZE,
          lastDoc
        );

      setEvents((prev) => [...prev, ...result.events]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Error loading more events:", error);
      setError("Failed to load more events. Please try again.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, lastDoc, setEvents, filterOptions]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoadingMore) {
          loadMoreEvents();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, loadMoreEvents]);

  useEffect(() => {
    loadInitialEvents();
  }, [loadInitialEvents]);

  useEffect(() => {
    setEvents([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
  }, [setEvents]);

  const handleDelete = (event: Event) => {
    onEventRemove?.(event);
  };

  const handleEdit = (event: Event) => {
    onEventEdit?.(event);
  };

  const handleRetry = () => {
    if (events.length === 0) {
      loadInitialEvents();
    } else {
      loadMoreEvents();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-black mx-auto mb-4" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error && events.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-black transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No events found
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <EventCard
            key={`${event.id}-${index}`}
            event={event}
            className="animate-fade-in"
            onEdit={handleEdit}
            onRemove={handleDelete}
            onEnvite={onInviteEvent}
            eventMode={gridTypeVisualization}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={loadingRef} className="flex justify-center items-center py-8">
          {isLoadingMore && (
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-black mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading more events...</p>
            </div>
          )}
        </div>
      )}

      {error && events.length > 0 && (
        <div className="flex justify-center items-center py-6">
          <div className="text-center">
            <p className="text-red-600 text-sm mb-2">{error}</p>
            <button
              onClick={handleRetry}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {!hasMore && events.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            You've reached the end of the events list
          </p>
        </div>
      )}
    </div>
  );
};

export default GridContainer;
