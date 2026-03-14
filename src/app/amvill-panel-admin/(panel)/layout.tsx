import { AdminSidebarLayout } from "@/features/admin/presentation/AdminSidebarLayout"

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
    return <AdminSidebarLayout>{children}</AdminSidebarLayout>
}
