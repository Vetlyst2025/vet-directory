import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full header-brand">
      {/* Logo and Tagline */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
        {/* Logo on the left - 2x larger */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Madison Vet Finder"
            width={160}
            height={160}
            style={{ maxHeight: '160px', objectFit: 'contain' }}
          />
        </Link>

        {/* Tagline on the right */}
        <div className="text-white text-right">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>
            Helping pet owners find care they can trust.
          </p>
        </div>
      </div>
    </header>
  );
}
