import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border-glass mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/20">
          Korean by Bias — Learn the words your biases say.
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          <Github size={14} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
