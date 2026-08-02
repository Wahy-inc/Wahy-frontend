import { api } from "./client";
import type { SheikhPreferencesRead, SheikhPreferencesUpdate } from "../data-contracts";

export function getSheikhPreferences(): Promise<SheikhPreferencesRead> {
	return api<SheikhPreferencesRead>("/api/v1/sheikh/preferences");
}

export function updateSheikhPreferences(
	payload: SheikhPreferencesUpdate,
): Promise<SheikhPreferencesRead> {
	return api<SheikhPreferencesRead>("/api/v1/sheikh/preferences", {
		method: "PATCH",
		body: payload,
	});
}
