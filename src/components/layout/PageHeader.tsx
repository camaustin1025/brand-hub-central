import { Heading } from "@/components/layout/Heading";
export function PageHeader({
  eyebrow,
  title,
  subhead,
}: {
  eyebrow: string;
  title: string;
  subhead?: string;
}) {
  return (
    <div className="container max-w-3xl py-16 md:py-20">
      <p className="eyebrow mb-3">{eyebrow}</p>
      <Heading as="h1" className="text-4xl font-extrabold leading-tight md:text-5xl">{title}</Heading>
      {subhead && (
        <p className="mt-4 text-lg text-foreground md:text-xl">{subhead}</p>
      )}
    </div>
  );
}
