import Image from "next/image"

type LogoSOProps = {
  className?: string
  variant?: "mark" | "lockup"
  priority?: boolean
}

export function LogoSO({ className, variant = "mark", priority = false }: LogoSOProps) {
  if (variant === "lockup") {
    return (
      <Image
        src="/logo-full.svg"
        alt="Scholarly Open"
        width={1370}
        height={430}
        className={className}
        priority={priority}
      />
    )
  }

  return (
    <Image
      src="/logo-mark.svg"
      alt="Scholarly Open"
      width={150}
      height={120}
      className={className}
      priority={priority}
    />
  )
}
