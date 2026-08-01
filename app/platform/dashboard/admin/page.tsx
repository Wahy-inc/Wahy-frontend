import { redirect } from "next/navigation";

export default function AdminIndexPage() {
	redirect("/platform/dashboard/admin/home");
}
