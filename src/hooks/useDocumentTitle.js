import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} | Airconic Tourister`
      : "Airconic Tourister";
  }, [title]);
}
