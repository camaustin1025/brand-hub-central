import { createContext, useContext } from "react";

export type SinglePageContextValue = {
  embedded: boolean;
  idPrefix: string;
};

export const SinglePageContext = createContext<SinglePageContextValue>({
  embedded: false,
  idPrefix: "",
});

export function useSinglePageContext() {
  return useContext(SinglePageContext);
}

export function chapterAnchor(idPrefix: string, id: string) {
  return idPrefix ? `${idPrefix}-${id}` : id;
}
