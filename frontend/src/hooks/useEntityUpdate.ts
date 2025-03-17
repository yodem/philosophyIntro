import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { Content } from "@/types";

type EntityType = "term" | "question" | "philosopher";
type EntityMessages = {
  success: string;
  error: string;
};

const entityMessages: Record<EntityType, EntityMessages> = {
  term: {
    success: "המושג עודכן בהצלחה",
    error: "שגיאה בעדכון המושג",
  },
  question: {
    success: "השאלה עודכנה בהצלחה",
    error: "שגיאה בעדכון השאלה",
  },
  philosopher: {
    success: "הפילוסוף עודכן בהצלחה",
    error: "שגיאה בעדכון הפילוסוף",
  },
};

type UpdateFn = (id: string, data: Partial<Content>) => Promise<Content>;

export function useEntityUpdate(entityType: EntityType, updateApi: UpdateFn) {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updateEntity = async (id: string, data: Partial<Content>) => {
    try {
      const res = await updateApi(id, data);
      if (res) {
        // Ensure we use the correct ID from the response which might be different
        const entityId = res.id || id;

        // Invalidate entity-specific query with the exact same key structure as used in loaders
        queryClient.invalidateQueries({ queryKey: [entityType, entityId] });

        // Also invalidate the content query since they share the same underlying data
        queryClient.invalidateQueries({ queryKey: ["content", entityId] });

        // Invalidate list queries for this entity type
        queryClient.invalidateQueries({ queryKey: [entityType] });
        queryClient.invalidateQueries({ queryKey: ["content"] });

        enqueueSnackbar(entityMessages[entityType].success, {
          variant: "success",
        });
      }
      return res;
    } catch (error) {
      enqueueSnackbar(entityMessages[entityType].error, { variant: "error" });
      console.error(`Error updating ${entityType}:`, error);
      throw error;
    }
  };

  return updateEntity;
}
