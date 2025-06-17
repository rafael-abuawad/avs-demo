import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 mt-auto">
      <div className="container flex flex-col items-center justify-center gap-2">
        <a
          href="https://github.com/rafael-abuawad/avs-demo"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rafael Abuawad's GitHub profile"
        >
          <Github className="h-6 w-6" />
        </a>
        <p className="text-sm text-center text-muted-foreground">
          Made by Rafael Abuawad, for <br /> the{" "}
          <a
            href="https://github.com/ivanalexo/yo-custidio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            YoCusodio
          </a>{" "}
          initiative.
        </p>
      </div>
    </footer>
  );
}
