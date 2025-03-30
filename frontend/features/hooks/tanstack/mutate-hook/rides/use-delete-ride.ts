import { deleteRide } from "@/features/actions/ride/ride";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useDeleteRide = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRide,
    onSuccess: () => {
        
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}