import { Button } from "@/components/ui/button";
import { javascript } from "@codemirror/lang-javascript";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { tokyoNightDay } from "@uiw/codemirror-theme-tokyo-night-day";
import CodeMirror from "@uiw/react-codemirror";
import { Copy, Download } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { toast } from "../_hooks/use-toast";
import { SVGPreview } from "./SVGPreview";

interface ConvertedCodeProps {
	code: string;
	title: string;
}

export function ConvertedCode({ code, title }: ConvertedCodeProps) {
	const [copied, setCopied] = useState(false);
	const { resolvedTheme } = useTheme();

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		toast({
			title: "Copied to clipboard",
			description: "The converted code has been copied to your clipboard.",
		});
		setTimeout(() => setCopied(false), 2000);
	};

	const handleDownload = () => {
		const blob = new Blob([code], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${title}.tsx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast({
			title: "File downloaded",
			description: `The converted code has been downloaded as '${title}.tsx'.`,
		});
	};

	return (
		<div className="flex flex-col gap-4 lg:flex-row">
			<div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
				<div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="w-3 h-3 rounded-full bg-red-500" />
						<div className="w-3 h-3 rounded-full bg-yellow-500" />
						<div className="w-3 h-3 rounded-full bg-green-500" />
						<span className="ml-2 text-sm font-medium">{title}.tsx</span>
					</div>
					<div className="flex space-x-2">
						<Button
							size="sm"
							variant="ghost"
							type="button"
							onClick={handleCopy}
						>
							<Copy className="w-4 h-4 mr-2" />
							{copied ? "Copied!" : "Copy"}
						</Button>
						<Button
							size="sm"
							variant="ghost"
							type="button"
							onClick={handleDownload}
						>
							<Download className="w-4 h-4 mr-2" />
							Download
						</Button>
					</div>
				</div>
				<CodeMirror
					value={code}
					extensions={[
						javascript({
							jsx: true,
							typescript: true,
						}),
					]}
					theme={resolvedTheme === "dark" ? tokyoNight : tokyoNightDay}
					readOnly={true}
					className="overflow-y-auto resize-y min-h-[200px] max-h-[500px]"
				/>
			</div>
			<SVGPreview code={code} />
		</div>
	);
}
