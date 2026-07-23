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
      <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{title}</h1>
      {subhead && (
        <p className="mt-4 text-lg text-muted-foreground md:text-xl">{subhead}</p>
      )}
    </div>
  );
}
