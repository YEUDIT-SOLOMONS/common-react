export function Loader({ text = 'טוען...' }: { text?: string }) {
  return (
    <div className="loader" role="status">
      <div className="loader-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      {text}
    </div>
  )
}
