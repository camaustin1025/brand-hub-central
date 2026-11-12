import { Heading } from "@/components/layout/Heading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow mb-3">404</p>
      <Heading as="h1" className="text-4xl font-extrabold">This page isn't on the hub</Heading>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be from the old Frontify site. Everything is being re-homed
        here.
      </p>
      <Button asChild className="mt-6">
        <Link to="/">Back to the hub</Link>
      </Button>
    </div>
  );
}
