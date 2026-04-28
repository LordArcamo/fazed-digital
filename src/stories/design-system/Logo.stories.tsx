import type { Meta, StoryObj } from '@storybook/react-vite';

// ─── The real Fazed logo mark (3 actual SVG paths from Fazed_Logo.svg) ────────
const LogoPaths = ({ fill = 'currentColor' }: { fill?: string }) => (
  <g transform="translate(0 1500) scale(0.1 -0.1)" fill={fill}>
    <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
    <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
    <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
  </g>
);

// ─── Full wordmark component ──────────────────────────────────────────────────
function LogoFull({ size = 'md', theme = 'dark' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; theme?: 'dark' | 'light' | 'accent' }) {
  const sizes = { sm: '1rem', md: '1.4rem', lg: '2rem', xl: '3rem' };
  const fontSizes = { sm: '1rem', md: '1.45rem', lg: '2.1rem', xl: '3.2rem' };
  const monoSizes = { sm: '0.45rem', md: '0.6rem', lg: '0.85rem', xl: '1.2rem' };

  const markColor = theme === 'accent' ? 'var(--accent)' : theme === 'light' ? 'var(--black)' : 'var(--white)';
  const textColor = theme === 'light' ? 'var(--black)' : 'var(--white)';
  const subColor  = theme === 'light' ? 'var(--gray-500)' : 'var(--gray-500)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="372 205 755 1089"
        style={{ width: sizes[size], height: 'auto', color: markColor, flexShrink: 0 }}
        aria-hidden="true">
        <LogoPaths />
      </svg>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 700,
        fontSize: fontSizes[size],
        letterSpacing: '-0.01em',
        color: textColor,
      }}>
        Fazed
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: monoSizes[size],
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: subColor,
        alignSelf: 'flex-end',
        paddingBottom: '0.15em',
      }}>
        Digital
      </span>
    </div>
  );
}

// ─── Mark only ────────────────────────────────────────────────────────────────
function LogoMark({ size = 32, color = 'var(--white)' }: { size?: number; color?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="372 205 755 1089"
      style={{ width: size, height: 'auto', color }}
      aria-label="Fazed Digital">
      <LogoPaths />
    </svg>
  );
}

// ─── Favicon-style lockup ──────────────────────────────────────────────────────
function FaviconPreview() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 1300 1300" style={{ width: 80, height: 80 }}>
      <rect x="100" y="100" width="1300" height="1300" rx="220" fill="#090909"/>
      <g transform="translate(0 1500) scale(0.1 -0.1)" fill="#F5F4F0">
        <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
        <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
        <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
      </g>
      <circle cx="1280" cy="230" r="80" fill="#C9FF57"/>
    </svg>
  );
}

const meta: Meta = {
  title: 'Design System/Logo',
  parameters: {
    layout: 'centered',
    docs: { description: { component: 'Fazed Digital logo variations — mark, wordmark, and favicon.' } },
  },
};

export default meta;
type Story = StoryObj;

export const Wordmark: Story = {
  name: 'Wordmark — Dark',
  render: () => (
    <div style={{ padding: '3rem', background: 'var(--black)', display: 'inline-block', borderRadius: 12 }}>
      <LogoFull size="lg" theme="dark" />
    </div>
  ),
};

export const WordmarkLight: Story = {
  name: 'Wordmark — Light',
  render: () => (
    <div style={{ padding: '3rem', background: 'var(--white)', display: 'inline-block', borderRadius: 12 }}>
      <LogoFull size="lg" theme="light" />
    </div>
  ),
};

export const WordmarkAccent: Story = {
  name: 'Wordmark — Accent Mark',
  render: () => (
    <div style={{ padding: '3rem', background: 'var(--black)', display: 'inline-block', borderRadius: 12 }}>
      <LogoFull size="lg" theme="accent" />
    </div>
  ),
};

export const Sizes: Story = {
  name: 'Size Scale',
  render: () => (
    <div style={{ padding: '2.5rem', background: 'var(--black)', display: 'flex', flexDirection: 'column', gap: '2rem', borderRadius: 12 }}>
      {(['xl', 'lg', 'md', 'sm'] as const).map(size => (
        <div key={size} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-600)', width: 24 }}>{size}</span>
          <LogoFull size={size} />
        </div>
      ))}
    </div>
  ),
};

export const MarkOnly: Story = {
  name: 'Mark Only',
  render: () => (
    <div style={{ padding: '2rem', background: 'var(--black)', display: 'flex', gap: '2rem', alignItems: 'center', borderRadius: 12 }}>
      <LogoMark size={20} />
      <LogoMark size={32} />
      <LogoMark size={48} />
      <LogoMark size={64} />
      <LogoMark size={96} />
      <LogoMark size={64} color="var(--accent)" />
      <LogoMark size={64} color="var(--gray-600)" />
    </div>
  ),
};

export const Favicon: Story = {
  name: 'Favicon / App Icon',
  render: () => (
    <div style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <FaviconPreview />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)' }}>80×80</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 1300 1300" style={{ width: 48, height: 48 }}>
          <rect x="100" y="100" width="1300" height="1300" rx="220" fill="#090909"/>
          <g transform="translate(0 1500) scale(0.1 -0.1)" fill="#F5F4F0">
            <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
            <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
            <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
          </g>
          <circle cx="1280" cy="230" r="80" fill="#C9FF57"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)' }}>48×48</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="100 100 1300 1300" style={{ width: 32, height: 32 }}>
          <rect x="100" y="100" width="1300" height="1300" rx="220" fill="#090909"/>
          <g transform="translate(0 1500) scale(0.1 -0.1)" fill="#F5F4F0">
            <path d="M7445 12847 c-22 -13 -348 -206 -725 -429 -377 -222 -723 -427 -770 -455 -47 -27 -506 -299 -1020 -603 -514 -303 -969 -572 -1012 -597 -43 -25 -87 -56 -98 -70 -20 -26 -20 -37 -20 -3282 0 -2590 3 -3261 13 -3274 17 -22 3645 -2000 3679 -2005 26 -4 692 354 2443 1313 143 79 481 263 750 409 270 147 496 274 503 283 19 26 18 1456 -2 1472 -10 8 -27 4 -72 -20 -32 -18 -854 -465 -1826 -995 -972 -530 -1776 -964 -1787 -964 -24 0 -2303 1299 -2338 1332 l-23 21 0 2517 0 2517 23 20 c12 11 326 199 697 418 371 219 945 558 1275 753 884 522 1310 774 1495 883 118 70 166 103 168 118 3 18 -78 61 -637 341 -353 176 -649 320 -658 320 -10 0 -36 -11 -58 -23z"/>
            <path d="M9455 11664 c-28 -15 -295 -161 -595 -324 -300 -163 -624 -340 -720 -392 -96 -53 -195 -107 -220 -121 -25 -13 -241 -131 -480 -262 -239 -130 -500 -272 -580 -316 -80 -44 -341 -186 -580 -317 -319 -174 -438 -244 -447 -262 -17 -33 -19 -4306 -2 -4342 8 -18 164 -100 645 -341 349 -174 643 -317 653 -317 11 0 21 9 25 23 3 12 6 949 6 2083 l0 2061 23 20 c12 11 398 242 857 513 459 271 900 532 980 579 80 48 511 303 958 566 447 264 822 488 833 498 11 10 17 23 13 28 -9 15 -1281 649 -1302 649 -9 0 -40 -12 -67 -26z"/>
            <path d="M11135 10316 c-11 -7 -74 -42 -140 -78 -66 -36 -230 -126 -365 -201 -720 -396 -2614 -1437 -2698 -1482 -30 -16 -62 -40 -73 -53 -19 -24 -19 -70 -19 -1918 0 -1695 2 -1894 15 -1908 14 -14 79 16 664 309 366 182 651 331 655 340 3 9 6 537 6 1174 l0 1158 23 20 c12 12 456 274 987 583 531 309 975 573 988 586 l22 25 0 718 c0 725 -1 742 -34 740 -6 0 -20 -6 -31 -13z"/>
          </g>
          <circle cx="1280" cy="230" r="80" fill="#C9FF57"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray-500)' }}>32×32</span>
      </div>
    </div>
  ),
};

export const OnDarkBackground: Story = {
  name: 'On Dark BG',
  parameters: { backgrounds: { default: 'dark' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <LogoFull size="xl" />
    </div>
  ),
};

export const OnLightBackground: Story = {
  name: 'On Light BG',
  parameters: { backgrounds: { default: 'light' } },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2rem' }}>
      <LogoFull size="xl" theme="light" />
    </div>
  ),
};
