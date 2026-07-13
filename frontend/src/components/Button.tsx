import { LoaderCircle } from 'lucide-react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline'
  loading?: boolean
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  loading = false,
  disabled,
  ...rest
}: Props) {
  const classes = variant === 'outline' ? 'btn btn--outline' : 'btn btn--primary'
  const isDisabled = disabled || loading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={`${classes} ${loading ? 'btn--loading' : ''} ${className}`.trim()}
    >
      {loading && <LoaderCircle size={16} className="btn__spinner" aria-hidden="true" />}
      <span>{children}</span>
    </button>
  )
}
