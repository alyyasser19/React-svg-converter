"use client";

import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import useConvertSvgMutation from "../_hooks/use-convert-svg.mutation";
import { ConvertedCode } from "./ConvertedCode";
import UploadIcon from "./Icons/UploadIcon";

export function DropZone() {
	const [file, setFile] = useState<File | null>(null);

	const { mutate, isPending, data } = useConvertSvgMutation();

	const onDrop = useCallback((acceptedFiles: File[]) => {
		setFile(acceptedFiles[0]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: { "image/svg+xml": [".svg"] },
		multiple: false,
	});

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!file) return;

		const formData = new FormData();
		formData.append("svg", file);

		mutate(formData);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div
				{...getRootProps()}
				className={`p-8 border-2 border-dashed rounded-lg h-[300px] flex flex-col justify-center items-center text-center cursor-pointer transition-colors ${
					isDragActive
						? "border-primary bg-primary/10"
						: "border-muted-foreground hover:border-primary"
				}`}
			>
				<input {...getInputProps()} />
				<UploadIcon className="mx-auto h-12 w-12 text-muted-foreground" />
				<p className="mt-2 text-sm text-muted-foreground">
					{file
						? file.name
						: "Drag 'n' drop an SVG file here, or click to select a file"}
				</p>
			</div>
			{file && (
				<Button type="submit" className="w-full mt-4" disabled={isPending}>
					{isPending ? "Converting..." : "Convert SVG"}
				</Button>
			)}
			{data && <ConvertedCode code={data} />}
		</form>
	);
}
