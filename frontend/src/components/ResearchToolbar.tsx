type ToolbarOption = {
  value: string;
  label: string;
};

type ResearchToolbarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  countLabel: string;
  count: number;
  filters?: Array<{
    id: string;
    label: string;
    value: string;
    options: ToolbarOption[];
    onChange: (value: string) => void;
  }>;
  sort?: {
    label: string;
    value: string;
    options: ToolbarOption[];
    onChange: (value: string) => void;
  };
  onReset?: () => void;
};

const ResearchToolbar = ({
  query,
  onQueryChange,
  searchLabel,
  searchPlaceholder,
  countLabel,
  count,
  filters = [],
  sort,
  onReset,
}: ResearchToolbarProps) => {
  return (
    <section className="research-toolbar" aria-label="Research controls">
      <label className="stacked-field research-toolbar__search">
        <span>{searchLabel}</span>
        <input value={query} onChange={event => onQueryChange(event.target.value)} placeholder={searchPlaceholder} />
      </label>

      {filters.map(filter => (
        <label key={filter.id} className="stacked-field">
          <span>{filter.label}</span>
          <select value={filter.value} onChange={event => filter.onChange(event.target.value)}>
            {filter.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}

      {sort ? (
        <label className="stacked-field">
          <span>{sort.label}</span>
          <select value={sort.value} onChange={event => sort.onChange(event.target.value)}>
            {sort.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="research-toolbar__summary">
        <span>{countLabel}</span>
        <strong>{count}</strong>
      </div>

      {onReset ? (
        <button type="button" className="tree-chip research-toolbar__reset" onClick={onReset}>
          Reset
        </button>
      ) : null}
    </section>
  );
};

export default ResearchToolbar;
