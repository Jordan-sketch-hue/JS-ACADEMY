"use client";
import { useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "a" | "div";
  href?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", strength = 0.25, as: Tag = "button", href, onClick }: Props) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "translate(0px, 0px)";
    setTimeout(() => { if (el) el.style.transition = ""; }, 450);
  };

  const props: any = {
    ref,
    className,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick,
    ...(href ? { href } : {}),
  };

  return <Tag {...props}>{children}</Tag>;
}
