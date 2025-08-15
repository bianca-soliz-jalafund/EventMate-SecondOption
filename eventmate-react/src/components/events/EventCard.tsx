import Event from "@lib/models/Event";
import { Calendar, Users } from "lucide-react";
import Button from "../ui/Button";

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onRemove?: (event: Event) => void;
  className?: string;
  eventMode?: "admin" | "public";
  onEnvite?: (event: Event) => void;
}

const EventCard = ({
  event,
  onEdit,
  onRemove,
  className = "",
  eventMode = "public",
  onEnvite,
}: EventCardProps) => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      Music: "bg-pink-900 text-pink-100",
      Technology: "bg-pink-800 text-white",
      Networking: "bg-rose-700 text-white",
      Social: "bg-fuchsia-800 text-pink-100",
      Other: "bg-rose-900 text-pink-50",
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getPlaceholderImage = (): string => {
    return `data:image/svg+xml,%3Csvg width='400' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23374151' font-family='Arial, sans-serif' font-size='16'%3E${encodeURIComponent(
      event.category
    )}%3C/text%3E%3C/svg%3E`;
  };

  const handleInvite = () => onEnvite?.(event);
  const handleOnEdit = () => onEdit?.(event);
  const handleOnRemove = () => onRemove?.(event);

  return (
    <div
      className={`
        bg-pink-100 rounded-lg shadow-sm border border-pink-300 overflow-hidden
        transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
        cursor-pointer group ${className}
      `}
    >
      {/* Imagen + categoría */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || getPlaceholderImage()}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = getPlaceholderImage();
          }}
        />

        <div className="absolute top-3 left-3">
          <span
            className={`
              px-3 py-1 rounded-full text-xs font-medium
              ${getCategoryColor(event.category)}
            `}
          >
            {event.category}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>
              {formatDate(event.date)} at {formatTime(event.date)}
            </span>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{event.invitees.length || 0} attendees</span>
          </div>
        </div>

        {/* Autor */}
        <div className="mt-4 pt-3 border-t border-pink-200">
          <div className="text-sm text-gray-600">
            by{" "}
            <span className="font-medium text-gray-900">
              {event.ownerName}
            </span>
          </div>
        </div>
      </div>

      {/* Botones admin */}
      {eventMode === "admin" && (
        <div className="flex gap-2 w-full px-4 pb-4 justify-end">
          <Button type="button" variant="primary" onClick={handleInvite}>
            Invite
          </Button>
          <Button type="button" variant="primary" onClick={handleOnEdit}>
            Edit
          </Button>
          <Button type="button" variant="destructive" onClick={handleOnRemove}>
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default EventCard;
