export default function ErrorMessage({ children }) {
  if (!children) return null;
  return (
    <div className="error" role="alert">
      {children}
    </div>
  );
}
