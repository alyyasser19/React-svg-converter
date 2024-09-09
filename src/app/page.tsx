"use client";

import { CodeEditor } from "@/components/CodeEditor";
import { DropZone } from "@/components/DropZone";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactQueryProvider } from "./_components/providers/ReactQueryProvider";

export default function Home() {
	return (
		<ReactQueryProvider>
			<Card className="max-w-3xl mx-auto shadow-lg">
				<CardContent className="p-6">
					<Tabs defaultValue="dropzone" className="space-y-6">
						<TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
							<TabsTrigger value="dropzone">Drop SVG</TabsTrigger>
							<TabsTrigger value="paste">Paste SVG</TabsTrigger>
						</TabsList>
						<TabsContent value="dropzone">
							<DropZone />
						</TabsContent>
						<TabsContent value="paste">
							<CodeEditor />
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</ReactQueryProvider>
	);
}
