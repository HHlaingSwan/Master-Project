import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "../lib/toast";
import axiosInstance from "../api";

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: unknown) => void;
  showErrorToast?: boolean;
}

export function useApi<T>(
  key: string[],
  url: string,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError, showErrorToast = true } = options;

  const { data, isLoading, error, refetch } = useQuery<T>({
    queryKey: key,
    queryFn: () => axiosInstance.get(url).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  if (error && showErrorToast) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";
    toast.error(errorMessage);
  }

  return {
    data,
    isLoading,
    error,
    refetch,
    isError: !!error,
    isSuccess: !isLoading && !error && !!data,
  };
}

export function useMutationApi<T>(
  mutationFn: (data: T) => Promise<unknown>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError, showErrorToast = true } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: T) => mutationFn(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries();
      toast.success("Operation completed successfully!");
      onSuccess?.(data);
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Operation failed.";
      toast.error(`Error: ${errorMessage}`);
      onError?.(error);
    },
  });
}

export function useGet<T>(url: string, key?: string[], options?: UseApiOptions) {
  return useApi<T>(key || [url], url, options);
}

export function usePost<T>(url: string, options: UseApiOptions = {}) {
  return useMutationApi<T>((data) => axiosInstance.post(url, data), options);
}

export function usePut<T>(url: string, options: UseApiOptions = {}) {
  return useMutationApi<T>((data) => axiosInstance.put(url, data), options);
}

export function useDelete(url: string, options: UseApiOptions = {}) {
  return useMutationApi<null>((_) => axiosInstance.delete(url), options);
}
