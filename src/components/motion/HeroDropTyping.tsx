import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const LINE_A = "New Drop";
const LINE_B = ` · ${BRAND.city}`;
const FULL = `${LINE_A}${LINE_B}`;

const CHAR_MS = 42;
const LINE_PAUSE_MS = 220;

type Props = { className?: string };

/**
 * Hero kicker: types "New Drop · {city}"; mobile uses a two-line layout with a short pause between lines.
 */
export function HeroDropTyping({ className }: Props) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) {
      setCount(FULL.length);
      return;
    }

    let i = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      i += 1;
      setCount(i);
      if (i < FULL.length) {
        const atBreak = i === LINE_A.length;
        timer = setTimeout(tick, atBreak ? LINE_PAUSE_MS : CHAR_MS);
      }
    };

    timer = setTimeout(tick, CHAR_MS);
    return () => clearTimeout(timer);
  }, [reduce]);

  const showCursor = !reduce && count < FULL.length;

  return (
    <p
      className={cn("text-xs uppercase tracking-[0.4em] text-primary mb-6 min-h-[2.75rem] sm:min-h-0", className)}
      aria-label={FULL}
    >
      {/* Mobile: two lines */}
      <span className="flex flex-col gap-2 sm:hidden">
        <span className="flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-primary shrink-0" aria-hidden />
          <span className="font-medium tracking-[0.35em]">
            {FULL.slice(0, Math.min(count, LINE_A.length))}
            {showCursor && count <= LINE_A.length ? (
              <span className="inline-block w-[0.45em] h-[1em] ml-0.5 align-[-0.15em] bg-primary/80 animate-pulse rounded-[1px]" aria-hidden />
            ) : null}
          </span>
        </span>
        <span className="pl-11 font-medium tracking-[0.35em]">
          {count > LINE_A.length ? FULL.slice(LINE_A.length, count) : null}
          {showCursor && count > LINE_A.length ? (
            <span className="inline-block w-[0.45em] h-[1em] ml-0.5 align-[-0.15em] bg-primary/80 animate-pulse rounded-[1px]" aria-hidden />
          ) : null}
        </span>
      </span>

      {/* Desktop: single line */}
      <span className="hidden sm:inline font-medium tracking-[0.35em]">
        <span className="inline-block h-px w-8 bg-primary align-middle mr-3" aria-hidden />
        {FULL.slice(0, count)}
        {showCursor ? (
          <span className="inline-block w-[0.45em] h-[1em] ml-1 align-[-0.12em] bg-primary/80 animate-pulse rounded-[1px]" aria-hidden />
        ) : null}
      </span>
    </p>
  );
}
