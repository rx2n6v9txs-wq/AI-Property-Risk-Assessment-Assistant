type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' }

export default function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  const classes = variant === 'outline' ? 'btn btn--outline' : 'btn btn--primary'

  return (
    <button
      {...rest}
      className={`${classes} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
