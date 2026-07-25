import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/assistant")({ component: Assistant });

function Assistant() {
  return <Navigate to="/dashboard" replace />;
}
