import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";

interface SVGPreviewProps {
	code: string;
}

export function SVGPreview({ code }: SVGPreviewProps) {
	const [svgContent, setSvgContent] = useState<string | null>(null);

	useEffect(() => {
		const extractAndSanitizeSvgContent = () => {
			try {
				const match = code.match(/<svg[\s\S]*?<\/svg>/);
				if (match) {
					const rawSvg = match[0];
					const sanitizedSvg = DOMPurify.sanitize(rawSvg, {
						USE_PROFILES: { svg: true, svgFilters: true },
					});
					setSvgContent(sanitizedSvg);
				} else {
					console.error("No SVG content found in the code");
				}
			} catch (error) {
				console.error("Error extracting or sanitizing SVG content:", error);
			}
		};

		extractAndSanitizeSvgContent();
	}, [code]);

	if (!svgContent) {
		return null;
	}

	const SVGComponent = React.memo(({ size }: { size: number }) => (
		<div
			dangerouslySetInnerHTML={{ __html: svgContent }}
			className="text-primary"
			style={{
				width: size,
				height: size,
			}}
		/>
	));

	SVGComponent.displayName = "SVGComponent";

	return (
		<div className="mt-4 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900  w-full h-auto">
			<div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 flex items-center">
				<div className="flex items-center space-x-2">
					<div className="w-3 h-3 rounded-full bg-red-500" />
					<div className="w-3 h-3 rounded-full bg-yellow-500" />
					<div className="w-3 h-3 rounded-full bg-green-500" />
					<span className="ml-2 text-sm font-medium">Preview</span>
				</div>
			</div>
			<div className="p-4 flex flex-col items-center justify-center space-y-4">
				<SVGComponent size={24} />
				<SVGComponent size={48} />
				<SVGComponent size={72} />
			</div>
		</div>
	);
}
