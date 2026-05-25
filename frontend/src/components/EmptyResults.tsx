type EmptyResultsProps = {
  title?: string;
  message?: string;
};

const EmptyResults = ({
  title = 'No matching entries',
  message = 'Try a broader search, clear one filter, or switch evidence lanes to widen the database view.',
}: EmptyResultsProps) => (
  <div className="glass-panel empty-results" role="status">
    <h3>{title}</h3>
    <p>{message}</p>
  </div>
);

export default EmptyResults;
