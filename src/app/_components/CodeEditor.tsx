"use client";

import { Button } from "@/components/ui/button";
import { html } from "@codemirror/lang-html";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import CodeMirror from "@uiw/react-codemirror";
import { useTheme } from "next-themes";
import { useState } from "react";
import useConvertSvgMutation from "../_hooks/use-convert-svg.mutation";
import { ConvertedCode } from "./ConvertedCode";

export function CodeEditor() {
	const [svgCode, setSvgCode] = useState("");
	const { mutate, isPending, data } = useConvertSvgMutation();
	const { resolvedTheme } = useTheme();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<CodeMirror
				value={svgCode}
				extensions={[html()]}
				theme={resolvedTheme === "dark" ? tokyoNight : tokyoNightDay}
				onChange={(value) => setSvgCode(value)}
				height="300px"
				placeholder="Paste your SVG code here..."
				className="border-gray-200 dark:border-gray-700 border rounded-2xl overflow-auto"
			/>
			{svgCode && (
				<Button type="submit" className="w-full mt-4" disabled={isPending}>
					{isPending ? "Converting..." : "Convert SVG"}
				</Button>
			)}
			{data?.code && data?.title && (
				<ConvertedCode code={data.code} title={data.title} />
			)}
		</form>
	);
}
