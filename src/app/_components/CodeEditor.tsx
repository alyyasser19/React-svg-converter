"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import useConvertSvgMutation from "../_hooks/use-convert-svg.mutation";
import { ConvertedCode } from "./ConvertedCode";

export function CodeEditor() {
	const [svgCode, setSvgCode] = useState("");
	const { mutate, isPending, isSuccess, data } = useConvertSvgMutation();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<Textarea
				name="svg"
				placeholder="Paste your SVG code here..."
				value={svgCode}
				onChange={(e) => setSvgCode(e.target.value)}
				className="min-h-[200px] font-mono"
			/>
			{svgCode && (
				<Button type="submit" className="w-full mt-4" disabled={isPending}>
					{isPending ? "Converting..." : "Convert SVG"}
				</Button>
			)}
			{isSuccess && data && <ConvertedCode code={data} />}
		</form>
	);
}
