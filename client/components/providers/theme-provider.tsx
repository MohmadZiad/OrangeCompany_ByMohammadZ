"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      disableTransitionOnChange
      {...props}
      themes={["light", "dark"]}
      storageKey="orange-tool-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
