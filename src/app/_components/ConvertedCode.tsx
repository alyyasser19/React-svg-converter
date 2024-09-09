import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";
import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "../_hooks/use-toast";

interface ConvertedCodeProps {
	code: string;
}

export function ConvertedCode({ code }: ConvertedCodeProps) {
	const [copied, setCopied] = useState(false);

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
		a.download = "converted-icon.tsx";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		toast({
			title: "File downloaded",
			description:
				"The converted code has been downloaded as 'converted-icon.tsx'.",
		});
	};

	return (
		<div className="mt-4 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
			<div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500" />
					<div className="w-3 h-3 rounded-full bg-yellow-500" />
					<div className="w-3 h-3 rounded-full bg-green-500" />
					<span className="ml-2 text-sm font-medium">converted-icon.tsx</span>
				</div>
				<div className="flex space-x-2">
					<Button size="sm" variant="ghost" type="button" onClick={handleCopy}>
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
			<SyntaxHighlighter
				language="typescript"
				style={vscDarkPlus}
				customStyle={{
					margin: 0,
					borderRadius: 0,
					maxHeight: "400px",
				}}
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}
