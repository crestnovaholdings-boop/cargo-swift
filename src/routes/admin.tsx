import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Worldwide Cargo Transit" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: () => <Outlet />,
});