import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorBannerProps {
	/** Human-readable message, e.g. an error message from an ApiError. */
	message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
	if (!message) {
		return null;
	}
	return (
		<Alert
			variant="destructive"
			className="border-destructive/30 bg-destructive/5"
		>
			<AlertCircle />
			<AlertDescription>{message}</AlertDescription>
		</Alert>
	);
}
