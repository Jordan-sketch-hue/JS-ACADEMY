import type { SignatureValue } from "@/lib/contracts/signature";

/**
 * Renders an e-signature in "ink on paper" style — always dark ink on a light
 * strip so it stays legible on the dark app theme and prints exactly as shown.
 */
export function SignatureView({
  value,
  className = "",
}: {
  value: SignatureValue;
  className?: string;
}) {
  return (
    <div className={`flex h-16 items-end justify-start overflow-hidden ${className}`}>
      {value.kind === "typed" ? (
        <span
          className="select-none whitespace-nowrap pb-1 text-[2rem] leading-none text-neutral-900"
          style={{ fontFamily: "var(--font-signature), cursive" }}
        >
          {value.name}
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- data URL, not an asset
        <img
          src={value.dataUrl}
          alt="Signature"
          className="h-full w-auto max-w-full object-contain object-left-bottom"
        />
      )}
    </div>
  );
}
