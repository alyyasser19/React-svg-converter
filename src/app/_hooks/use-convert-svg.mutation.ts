import { useMutation } from "@tanstack/react-query";
import { convertSvgToReact } from "../_actions/convert-svg";
import { toast } from "./use-toast";

export default function useConvertSvgMutation() {
	return useMutation({
		mutationFn: async (formData: FormData) => {
			const response = await convertSvgToReact(formData);
			if (response.success) {
				return response.code;
			}
			throw new Error(response.error);
		},
		onSuccess: () => {
			toast({
				title: "Conversion Successful",
				description:
					"Your SVG has been converted to a Lucide-compatible React component.",
			});
		},
		onError: (error) => {
			toast({
				title: "Conversion Failed",
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive",
			});
		},
	});
}
