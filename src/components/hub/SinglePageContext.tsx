import type { ReactNode } from "react";
import { SinglePageContext } from "@/components/hub/single-page-context";

export function SinglePageChapter({ id, children }: { id: string; children: ReactNode }) {
  return (
    <SinglePageContext.Provider value={{ embedded: true, idPrefix: id }}>
      <div className="hub-chapter">{children}</div>
    </SinglePageContext.Provider>
  );
}
