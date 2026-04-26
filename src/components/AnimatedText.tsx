import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Props {
  text: string;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  once?: boolean;
}

export default function AnimatedText({ text, as: Tag = 'p', className, delay = 0, stagger = 0.055, style, once = true }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el     = ref.current!;
    const inners = el.querySelectorAll<HTMLElement>('.inner');

    gsap.fromTo(inners,
      { y: '108%', skewY: 2 },
      {
        y: '0%', skewY: 0,
        stagger, duration: 1.0, ease: 'power3.out', delay,
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: once ? 'play none none none' : 'play none none reset' },
      }
    );
  }, { scope: ref });

  const El = Tag as React.ElementType;
  const words = text.split(' ');

  return (
    <El ref={ref} className={className} style={style}>
      {words.map((w, i) => (
        <span key={i} className="clip-word">
          <span className="inner">{w}{i < words.length - 1 ? '\u00A0' : ''}</span>
        </span>
      ))}
    </El>
  );
}
