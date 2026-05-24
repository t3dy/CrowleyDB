import type { QuoteBlock } from '../crowleyQuotes';

type QuoteCalloutProps = {
  quote: QuoteBlock;
  className?: string;
};

const QuoteCallout = ({ quote, className = '' }: QuoteCalloutProps) => {
  return (
    <section className={`glass-panel quote-callout ${className}`.trim()}>
      <p className="quote-callout__kicker">Primary-text citation</p>
      <blockquote className="quote-callout__quote">“{quote.quote}”</blockquote>
      <div className="quote-callout__meta">
        <div>
          <span>{quote.sourceTitle}</span>
          <strong>{quote.citation}</strong>
        </div>
        {quote.sourceUrl ? (
          <a href={quote.sourceUrl} target="_blank" rel="noreferrer">
            Source text
          </a>
        ) : null}
      </div>
      {quote.note ? <p className="quote-callout__note">{quote.note}</p> : null}
    </section>
  );
};

export default QuoteCallout;
