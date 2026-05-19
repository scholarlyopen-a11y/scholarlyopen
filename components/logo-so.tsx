export function LogoSO({ className }: { className?: string }) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="1" y="1" width="38" height="38" rx="6" fill="#05381f" />
      <rect x="2.5" y="2.5" width="35" height="35" rx="5.5" stroke="#9ee6b5" strokeWidth="3" fill="none" />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontFamily="Inter, Arial, sans-serif" fontWeight="700" fontSize="16">SO</text>
    </svg>
  )
}
