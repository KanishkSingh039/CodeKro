import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { COPY } from '../../constants/copy';

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default
  const faqCopy = COPY.landing.faq;

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx));
  };

  return (
    <section id="faq" className="py-20 border-b border-border bg-base" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-mono uppercase tracking-wider text-muted mb-2">FAQ</p>
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-text">
            {faqCopy.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted">
            {faqCopy.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqCopy.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const buttonId = `faq-btn-${idx}`;
            const panelId = `faq-panel-${idx}`;

            return (
              <div
                key={item.q}
                className="rounded-lg border border-border bg-surface overflow-hidden transition-colors"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-medium text-text hover:bg-surface-raised focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-muted flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-text' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'block' : 'hidden'}
                >
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted leading-relaxed border-t border-border/50">
                    {item.a}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
