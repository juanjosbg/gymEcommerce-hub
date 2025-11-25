import Link from "next/link";
import type { FC } from "react";
import React from "react";
import { RiMicrosoftLoopFill } from "react-icons/ri";
import LogoImage from "@/public/logo-icon.png";
interface LogoProps {
  className?: string;
}

const Logo: FC<LogoProps> = ({ className = "hidden" }) => {
  return (
    <Link className="flex cursor-pointer items-center gap-2" href="/">
      <img src={LogoImage.src} alt="Logo" className="h-20 w-20" />
      <span className={`${className} text-2xl font-bold`}>FITMEX STORE</span>
    </Link>
  );
};

export default Logo;
