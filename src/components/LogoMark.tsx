export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true" fill="none">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="256" cy="256" r="136" strokeWidth="22" />
        <circle cx="256" cy="256" r="70" strokeWidth="16" />
        <g strokeWidth="15">
          <path d="M256 120v48M256 344v48M120 256h48M344 256h48" />
          <path d="M160 160l36 36M316 316l36 36M352 160l-36 36M196 316l-36 36" />
        </g>
      </g>
      <circle cx="256" cy="256" r="24" fill="#0e8a5f" />
    </svg>
  );
}
