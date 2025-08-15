import {
  defaultEventFormData,
  eventFormSchema,
  type EventFormData,
} from "@/schemas/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageUploader from "../ImageUploader";
import InputForm from "../InputForm";
import SelectInputForm from "../SelectInputForm";
import Button from "../ui/Button";

const EVENT_CATEGORIES = [
  "Music",
  "Technology",
  "Networking",
  "Social",
  "Other",
];

interface EventFormProps {
  onClose: () => void;
  onSubmit: (data: EventFormData) => Promise<void>;
  initialData?: Partial<EventFormData>;
  mode: "create" | "update";
}

const EventForm = ({
  onClose,
  onSubmit,
  initialData,
  mode,
}: EventFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // No changes needed here
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData || defaultEventFormData, // A simpler way to set defaults
  });

  const watchedImage = watch("image");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset(defaultEventFormData);
    }
  }, [initialData, reset]);

  const handleImageChange = (file: File | null) => {
    setValue("image", file, { shouldValidate: true }); // It's good practice to validate on change
  };

  // --- CHANGE #1: Simplified onFormSubmit handler ---
  const onFormSubmit = async (data: EventFormData) => {
    // For debugging, this is the most important line:
    console.log("Data being submitted:", data); // Check if data.place is undefined here

    try {
      setIsSubmitting(true);
      // No need for preparedData. The data from Zod is already in the correct shape.
      // The image field (if it's a File object) will be handled by your onSubmit function
      // which should upload it and get a URL before saving to Firestore.
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="space-y-6 bg-white rounded-lg p-6 max-h-[700px] overflow-y-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === "create" ? "Create New Event" : "Update Event"}
        </h2>
        <p className="text-gray-600 mt-2">
          {mode === "create"
            ? "Fill in the details to create your event"
            : "Update your event information"}
        </p>
      </div>

      <InputForm
        label="Event title"
        {...register("title")}
        placeholder="Enter event title"
        fullWidth
        errorMessage={errors.title?.message}
        isRequired
      />

      <InputForm
        label="Description"
        {...register("description")}
        placeholder="Describe your event"
        fullWidth
        errorMessage={errors.description?.message}
        isRequired
      />

      <InputForm
        label="Date & Time"
        {...register("date")}
        type="datetime-local"
        fullWidth
        errorMessage={errors.date?.message}
        isRequired
      />

      {/* --- CHANGE #2: Simplified register call for "place" --- */}
      <InputForm
        label="Location"
        placeholder="e.g., Plaza Colón, Cochabamba"
        fullWidth
        isRequired
        errorMessage={errors.place?.message}
        {...register("place")}
      />

      <SelectInputForm
        label="Event type"
        {...register("category")}
        prompt="Select a category"
        errorMessage={errors.category?.message}
        renderOptions={() =>
          EVENT_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))
        }
        isRequired
      />

      <ImageUploader
        label="Event image"
        isRequired
        value={watchedImage}
        onChange={handleImageChange}
        disabled={isSubmitting}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => {
            reset();
            onClose();
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {mode === "create" ? "Creating..." : "Updating..."}
            </div>
          ) : mode === "create" ? (
            "Create Event"
          ) : (
            "Update Event"
          )}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
