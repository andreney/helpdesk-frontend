import Icon from './Icon';

export default function Brand({ light = false }) {
  return (
    <div className={light ? 'brand brand-light' : 'brand'}>
      <span className="brand-mark">
        <Icon name="asterisk" />
      </span>
      <span>
        helpdesk<span className="brand-dot">.</span>
      </span>
    </div>
  );
}
