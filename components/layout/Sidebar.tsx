"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MENU_ITEMS } from "@/lib/menu/menu-definition";
import { hasPermission } from "@/lib/permissions/has-permission";
import { cn } from "@/lib/utils";

export function Sidebar({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();
  const items = MENU_ITEMS.filter(
    (item) =>
      !item.requiredPermission ||
      hasPermission(permissions, item.requiredPermission),
  );

  return (
    <nav
      aria-label="Navegación principal"
      className="flex w-56 shrink-0 flex-col gap-1 border-r bg-muted/30 p-4"
    >
      <span className="mb-2 px-2 text-sm font-semibold text-foreground">
        Pagarés COINTRAMIN
      </span>
      {items.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
