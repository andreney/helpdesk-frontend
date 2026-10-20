import Avatar from '@/components/ui/Avatar';
import Icon from '@/components/ui/Icon';

export default function Topbar({ sectionLabel, userName, menuOpen, onOpenMenu }) {
  return (
    <header className="topbar">
      <div className="crumb">
        <button
          type="button"
          className="mobile-menu"
          aria-label="Abrir menu"
          aria-controls="app-sidebar"
          aria-expanded={menuOpen}
          onClick={onOpenMenu}
        >
          <Icon name="menu" />
        </button>
        Workspace <span aria-hidden="true">/</span>
        <strong>{sectionLabel}</strong>
      </div>
      <div className="top-actions">
        <Avatar small name={userName} />
      </div>
    </header>
  );
}
