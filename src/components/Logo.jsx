/**
 * Logo.jsx
 *
 * Parent Path logomark SVG.
 * aria-hidden="true" — decorative only; the adjacent h1 names the product.
 * Accepts a `size` prop (number, px) for width/height.
 */
export default function Logo({ size = 48 }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ flexShrink: 0 }}
    >
      <circle cx="24" cy="24" r="23" fill="#FAF7F0" />
      <path
        d="M14 36 C 20 30, 14 24, 22 20 S 30 12, 34 12"
        fill="none"
        stroke="#3F5E4D"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 6"
      />
      <circle cx="34" cy="12" r="4" fill="#E8C766" />
      <circle cx="14" cy="36" r="3" fill="#6F95C7" />
    </svg>
  )
}
