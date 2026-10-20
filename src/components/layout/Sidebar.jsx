import Avatar from '@/components/ui/Avatar';
import Brand from '@/components/ui/Brand';
import Icon from '@/components/ui/Icon';

export default function Sidebar({ items, activeId, onSelect, profile, onLogout, open }) {
  return (
    <aside id="app-sidebar" className={open ? 'sidebar sidebar-open' : 'sidebar'}>
      <Brand light />
      <div className="nav-label" id="nav-label">
        WORKSPACE
      </div>
      <nav aria-labelledby="nav-label">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={item.id === activeId ? 'nav-item nav-active' : 'nav-item'}
            aria-current={item.id === activeId ? 'page' : undefined}
            onClick={() => onSelect(item.id)}
          >
            <Icon name={item.icon} />
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="profile">
        <Avatar name={profile.name} />
        <div className="profile-name">
          <strong>{profile.name || 'Usuário'}</strong>
          <small>{profile.subtitle}</small>
        </div>
        <button type="button" className="logout" aria-label="Sair" title="Sair" onClick={onLogout}>
          <Icon name="logout" />
        </button>
      </div>
    </aside>
  );
}
