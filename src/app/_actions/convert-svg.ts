"use server";

import { parse } from "svg-parser";

type SvgNode = {
	type: "root" | "element" | "text";
	tagName?: string;
	properties?: { [key: string]: string | number | boolean };
	children?: SvgNode[];
	value?: string;
};

export async function convertSvgToReact(formData: FormData) {
	let svgContent = formData.get("svg");
	let componentTitle = "ReactIcon";

	if (!svgContent) {
		return { success: false, error: "No SVG content provided" };
	}
	if (svgContent instanceof File) {
		componentTitle = svgContent.name
			.replace(/\.svg$/, "")
			.split(/[-_\s]+/)
			.map((word, index) =>
				index === 0
					? word.toLowerCase()
					: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
			)
			.join("");
		componentTitle = `${componentTitle.charAt(0).toUpperCase() + componentTitle.slice(1)}Icon`;

		svgContent = await svgContent.text();
	}

	if (typeof svgContent !== "string") {
		return { success: false, error: "No SVG content provided" };
	}
	svgContent = cleanupSvgContent(svgContent);

	if (
		!svgContent.trim().startsWith("<svg") ||
		!svgContent.trim().endsWith("</svg>")
	) {
		return { success: false, error: "Invalid SVG format" };
	}

	try {
		const parsedSvg = parse(svgContent) as SvgNode;
		const svgElement = findSvgElement(parsedSvg);

		if (!svgElement) {
			return { success: false, error: "Invalid SVG structure" };
		}

		const svgAttributes = svgElement.properties || {};
		const svgChildren = svgElement.children || [];

		const componentCode = generateComponentCode(
			componentTitle,
			svgAttributes,
			svgChildren,
		);

		return { success: true, code: componentCode, title: componentTitle };
	} catch (error) {
		console.error("Error converting SVG:", error);
		return { success: false, error: "Error converting SVG. Please try again." };
	}
}

function findSvgElement(node: SvgNode): SvgNode | null {
	if (node.type === "element" && node.tagName === "svg") {
		return node;
	}

	if (node.type === "root" && Array.isArray(node.children)) {
		for (const child of node.children) {
			const result = findSvgElement(child);
			if (result) return result;
		}
	}

	return null;
}

function generateComponentCode(
	componentTitle: string,
	svgAttributes: { [key: string]: string | number | boolean },
	svgChildren: SvgNode[],
): string {
	const viewBox = svgAttributes.viewBox || "0 0 24 24";

	return `import type React from 'react';

interface ${componentTitle}Props extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  color?: string;
  strokeWidth?: string | number;
  absoluteStrokeWidth?: boolean;
}

const ${componentTitle}: React.FC<${componentTitle}Props> = ({
  size = 24,
  color = 'none',
  strokeWidth = 0.5,
  absoluteStrokeWidth,
  ...props
}) => {
  const strokeWidthValue = absoluteStrokeWidth ? Number(strokeWidth) : Number(strokeWidth) * 64 / Number(size);

  return (
    <svg
      width={size}
      height={size}
      viewBox="${viewBox}"
	  fill=${svgAttributes.fill ? `"${svgAttributes.fill}"` : "{color}"}
	  stroke=${svgAttributes.stroke ? `"${svgAttributes.stroke}"` : "{color}"}
	  strokeWidth=${svgAttributes.strokeWidth ? `"${svgAttributes.strokeWidth}"` : "{strokeWidthValue}"}
	  strokeLinecap="${svgAttributes.strokeLinecap || "round"}"
	  strokeLinejoin="${svgAttributes.strokeLinejoin || "round"}"
	  strokeMiterlimit="${svgAttributes.strokeMiterlimit || 10}"
	  strokeDasharray="${svgAttributes.strokeDasharray || 0}"
	  strokeDashoffset="${svgAttributes.strokeDashoffset || 0}"
	  strokeOpacity="${svgAttributes.strokeOpacity || 1}"
      {...props}
    >
      <title>${svgAttributes.title || componentTitle}</title>
      ${generateSvgContent(svgChildren, "currentColor", 2)}
    </svg>
  );
};

export default ${componentTitle};
`;
}

function generateSvgContent(
	nodes: SvgNode[],
	color: string,
	strokeWidthValue: number,
): string {
	return nodes
		.map((node) => {
			if (node.type === "text") {
				return node.value || "";
			}
			if (node.type === "element") {
				const { tagName, properties = {}, children = [] } = node;

				const attrs = Object.entries(properties)
					.map(([key, value]) => {
						const camelKey = key.replace(/-([a-z])/g, (g) =>
							g[1].toUpperCase(),
						);

						switch (camelKey) {
							case "fill":
								return `fill="${value ?? "currentColor"}"`;
							case "stroke":
								return `stroke="${value ?? "currentColor"}"`;
							case "strokeWidth":
								return `strokeWidth="${value ?? strokeWidthValue}"`;
							case "class":
								return `className="${value}"`;
							case "style": {
								if (typeof value === "string") {
									const styleObj = value.split(";").reduce(
										(acc, style) => {
											const [prop, val] = style.split(":");
											if (prop && val) acc[prop.trim()] = val.trim();
											return acc;
										},
										{} as Record<string, string>,
									);
									return `style={${JSON.stringify(styleObj)}}`;
								}
								return "";
							}
							default:
								// Handle boolean attributes or pass through the value as is
								return typeof value === "boolean"
									? value
										? camelKey
										: ""
									: `${camelKey}="${value}"`;
						}
					})
					.filter(Boolean) // Remove empty strings
					.join(" ");

				// Recursively generate child content
				const childContent = generateSvgContent(
					children,
					color,
					strokeWidthValue,
				);

				// Make single tags self-closing
				if (childContent === "") {
					return `<${tagName} ${attrs} />`;
				}

				return `<${tagName} ${attrs}>${childContent}</${tagName}>`;
			}
			return "";
		})
		.join("\n");
}

function cleanupSvgContent(svgContent: string): string {
	return svgContent
		.replace(/^\s*<\?xml[^>]*>\s*/i, "")
		.replace(/^\s*<!DOCTYPE[^>]*>\s*/i, "")
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
		.replace(/\s+/g, " ")
		.replace(/>\s+</g, "><")
		.trim();
}
