import { useLayoutEffect, useRef, useState, type HTMLAttributes } from "react";
import { Check, Link as LinkIcon } from "lucide-react";
import { writeClipboard } from "@/lib/clipboard";

/** Content headings own stable, readable anchors without changing existing IDs. */
export function Heading({ as: Tag, children, className = "", copyLink: showCopyLink = true, ...props }: HTMLAttributes<HTMLHeadingElement> & {
  as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Set false to drop the copy-link button (the Home hero headline doesn't need one). */
  copyLink?: boolean;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [message, setMessage] = useState("");
  const hidden = className.split(/\s+/).includes("sr-only");
  const plain = hidden || !showCopyLink;

  useLayoutEffect(() => {
    const heading = ref.current;
    if (!heading || hidden) return;
    if (!heading.id) {
      const label = heading.querySelector("[data-heading-label]")?.textContent || "Section";
      const base = label.normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      let id = base;
      let suffix = 2;
      while (document.getElementById(id)) id = `${base}-${suffix++}`;
      heading.id = id;
    }
    return () => clearTimeout(timer.current);
  }, [hidden]);

  async function copyLink() {
    if (!ref.current) return;
    const url = new URL(window.location.href);
    url.hash = ref.current.id;
    const copied = await writeClipboard(url.href);
    setMessage(copied ? "Copied" : "Couldn’t copy. Try again.");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(""), 2500);
  }

  return (
    <Tag ref={ref} className={`${className}${plain ? "" : " linkable-heading"}`} {...props}>
      {plain ? children : <><span data-heading-label="">{children}</span><button
        type="button"
        className="heading-copy-link"
        aria-label="Copy link to this section"
        title="Copy link to this section"
        onClick={copyLink}
      >
        {message === "Copied" ? <Check size={16} aria-hidden="true" /> : <LinkIcon size={16} aria-hidden="true" />}
        <span role="status" className={message ? "heading-copy-status" : "sr-only"}>{message}</span>
      </button></>}
    </Tag>
  );
}
