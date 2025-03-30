import { changeStatusOfCaptain } from "@/features/actions/captain/captain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeStatusOfCaptain,
    onSuccess: (res) => {
      if(res.message && res.success){
        queryClient.invalidateQueries({ queryKey: ["get_user_from_token"] })
    } 
    },
    onError: () => { },
    onSettled: () => { },
    onMutate: () => { },
})
}