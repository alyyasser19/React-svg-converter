import type React from "react";

interface UploadIconProps extends React.SVGProps<SVGSVGElement> {
	size?: string | number;
	color?: string;
	strokeWidth?: string | number;
	absoluteStrokeWidth?: boolean;
}

const UploadIcon: React.FC<UploadIconProps> = ({
	size = 24,
	color = "currentColor",
	strokeWidth = 1,
	absoluteStrokeWidth,
	...props
}) => {
	const strokeWidthValue = absoluteStrokeWidth
		? Number(strokeWidth)
		: (Number(strokeWidth) * 64) / Number(size);

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 25"
			fill="none"
			stroke={color}
			strokeWidth={strokeWidthValue}
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<title>Upload</title>
			<path
				d="M3 15.5C3 18.2614 5.23858 20.5 8 20.5H16C18.7614 20.5 21 18.2614 21 15.5M9 7.31153C9.74024 6.32454 10.599 5.43322 11.5564 4.65739C11.6859 4.55246 11.843 4.5 12 4.5M15 7.31153C14.2598 6.32454 13.401 5.43322 12.4436 4.65739C12.3141 4.55246 12.157 4.5 12 4.5M12 4.5V15.5"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
};

export default UploadIcon;
