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
  color = 'currentColor',
  strokeWidth = 2,
  absoluteStrokeWidth,
  ...props
}) => {
  const strokeWidthValue = absoluteStrokeWidth ? Number(strokeWidth) : Number(strokeWidth) * 64 / Number(size);

  return (
    <svg
      width={size}
      height={size}
      viewBox="${viewBox}"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidthValue}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <title>${svgAttributes.title || componentTitle}</title>
      ${generateSvgContent(svgChildren)}
    </svg>
  );
};

export default ${componentTitle};
`;
}

function generateSvgContent(nodes: SvgNode[]): string {
	return nodes
		.map((node) => {
			if (node.type === "text") {
				return node.value || "";
			}
			if (node.type === "element") {
				const { tagName, properties, children } = node;
				const attrs = properties
					? Object.entries(properties)
							.map(([key, value]) => {
								// Convert kebab-case to camelCase for React props
								const camelKey = key.replace(/-([a-z])/g, (g) =>
									g[1].toUpperCase(),
								);

								switch (camelKey) {
									case "stroke":
									case "fill":
										return `${camelKey}="currentColor"`;
									case "strokeWidth":
									case "strokeLinecap":
									case "strokeLinejoin":
									case "strokeDasharray":
									case "strokeDashoffset":
									case "strokeMiterlimit":
									case "strokeOpacity":
										return `${camelKey}="${value}"`;
									case "class":
										return `className="${value}"`;
									case "style": {
										const styleObj = (value as string).split(";").reduce(
											(acc, style) => {
												const [prop, val] = style.split(":");
												if (prop && val) {
													acc[prop.trim()] = val.trim();
												}
												return acc;
											},
											{} as Record<string, string>,
										);
										return `style={${JSON.stringify(styleObj)}}`;
									}
									default:
										// Handle boolean attributes
										if (typeof value === "boolean") {
											return value ? camelKey : "";
										}
										// Handle event handlers (convert to camelCase)
										if (camelKey.startsWith("on")) {
											return `${camelKey}={/* TODO: Add event handler */}`;
										}
										return `${camelKey}="${value}"`;
								}
							})
							.filter(Boolean) // Remove empty strings
							.join(" ")
					: "";
				if (children && children.length > 0) {
					const childContent = generateSvgContent(children);
					return `<${tagName} ${attrs}>${childContent}</${tagName}>`;
				}
				return `<${tagName} ${attrs} />`;
			}
			return "";
		})
		.join("\n");
}
