export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#0c0d10" />
      <circle
        cx="30"
        cy="32"
        r="18"
        fill="none"
        stroke="#f2bb4a"
        strokeWidth="6"
        strokeDasharray="92 20"
        strokeLinecap="round"
        transform="rotate(-18 30 32)"
      />
      <circle cx="45" cy="20" r="5" fill="#3ddcb0" />
      <rect x="26" y="24" width="7" height="7" rx="3.2" fill="#f2bb4a" />
      <rect x="26.5" y="33" width="6" height="15" rx="3" fill="#f2bb4a" />
    </svg>
  );
}
