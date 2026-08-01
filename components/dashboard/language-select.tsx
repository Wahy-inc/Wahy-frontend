"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLocalization } from "@/lib/localization-context";

const LANGUAGES = [
	{ value: "en", label: "English" },
	{ value: "ar", label: "العربية" },
	{ value: "ru", label: "Русский" },
	{ value: "fr", label: "Français" },
	{ value: "de", label: "Deutsch" },
	{ value: "es", label: "Español" },
] as const;

export function LanguageSelect() {
	const { t } = useLocalization();
	const { language, setLanguage } = useLocalization();
	return (
		<Select
			value={language}
			onValueChange={(value) =>
				setLanguage(value as (typeof LANGUAGES)[number]["value"])
			}
		>
			<SelectTrigger className="h-9 w-[130px]" aria-label={t("navbar.language")}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{LANGUAGES.map((item) => (
					<SelectItem key={item.value} value={item.value}>
						{item.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
