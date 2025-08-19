import { useState, useEffect, useCallback } from "react";
import { QueryDocumentSnapshot, type DocumentData } from "firebase/firestore";
import Event from "@lib/models/Event";
import { eventRepository } from "@lib/repositories/implementations/EventRepository";
import type { PaginatedEvents } from "@lib/repositories/interfaces/i_event_repository";

interface EventFilters {
  ownerId?: string;
  invitedToMeEmail?: string;
}

interface UseEventsOptions {
  pageSize?: number;
  filters?: EventFilters;
  autoLoad?: boolean;
}

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  clearEvents: () => void;
}

export const useEvents = (options: UseEventsOptions = {}): UseEventsReturn => {
  const { pageSize = 9, filters = {}, autoLoad = true } = options;

  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const filtersString = JSON.stringify(filters);

  const loadInitialEvents = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentFilters = JSON.parse(filtersString);
      
      const result: PaginatedEvents =
        await eventRepository.getEventsWithFilters(currentFilters, pageSize);

      setEvents(result.events);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading events:", error);
      setError(error.message || "Failed to load events");
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
    
  }, [filtersString, pageSize, isLoading]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !lastDoc) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const currentFilters = JSON.parse(filtersString);

      const result: PaginatedEvents =
        await eventRepository.getEventsWithFilters(currentFilters, pageSize, lastDoc);

      setEvents((prev) => [...prev, ...result.events]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      const error = err as Error;
      console.error("Error loading more events:", error);
      setError(error.message || "Failed to load more events");
    } finally {
      setIsLoadingMore(false);
    }
  }, [filtersString, pageSize, hasMore, isLoadingMore, lastDoc]);

  const refresh = useCallback(async () => {
    setEvents([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
    await loadInitialEvents();
  }, [loadInitialEvents]);

  const clearEvents = useCallback(() => {
    setEvents([]);
    setLastDoc(null);
    setHasMore(true);
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      refresh();
    }
  }, [filters, refresh, autoLoad]);

  return {
    events,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    clearEvents,
  };
};
