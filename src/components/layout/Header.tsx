"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import LanguageSwitcher from "./LanguageSwitcher";
import RegionSwitcher from "./RegionSwitcher";

interface HeaderProps {
  logo?: string;
}

export default function Header({ logo }: HeaderProps) {
  const params = useParams();
  const locale = params.locale as string;
  const region = params.region as string;

  return (
    <header className="bg-bg-secondary py-6">
      <Container>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}/${region}`} className="flex items-center">
            {logo ? (
              <Image
                src={logo}
                alt="Poem Booth"
                width={100}
                height={40}
                className="object-contain"
              />
            ) : (
              <span className="text-2xl font-display text-text-primary">
                Poem Booth
              </span>
            )}
          </Link>

          {/* Right side - Region and Language selectors */}
          <div className="flex items-center gap-4">
            <RegionSwitcher />
            <LanguageSwitcher />
          </div>
        </div>
      </Container>
    </header>
  );
}
