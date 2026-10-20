import Icon from './Icon';

/**
 * Botão padrão. `type="button"` por padrão para nunca submeter formulários sem querer.
 * `icon` adiciona um ícone ao final; `fullWidth` ocupa toda a largura.
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  fullWidth = false,
  icon,
  className = '',
  children,
  ...props
}) {
  const classes = ['button', `button-${variant}`, fullWidth && 'button-wide', className].filter(Boolean).join(' ');
  return (
    <button type={type} className={classes} {...props}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}
