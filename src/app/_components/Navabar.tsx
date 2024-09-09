import { ModeToggle } from "@/app/_components/ModeToggle";
import { Button } from "@/components/ui/button";
import { FileIcon, Github } from "lucide-react";
import Link from "next/link";

export function Navbar() {
	return (
		<nav className="border-b">
			<div className="container mx-auto px-4 py-4 flex justify-between items-center">
				<Link href="/" className="font-bold text-primary flex items-center">
					<FileIcon className="w-4 h-4 mr-1" />
					SVG2React
				</Link>
				<div className="flex items-center space-x-4">
					<ModeToggle />
					<Button variant="outline" size="icon" asChild>
						<Link
							href="https://github.com/alyyasser19/React-svg-convertor"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Github className="h-5 w-5" />
							<span className="sr-only">GitHub</span>
						</Link>
					</Button>
				</div>
			</div>
		</nav>
	);
}
