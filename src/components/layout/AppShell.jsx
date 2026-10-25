import { useState } from 'react';
import { formatLongDate } from '@/utils/formatters';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

/**
 * Estrutura da área autenticada (sidebar + topbar + conteúdo).
 * `navItems`: [{ id, label, icon }] — a seleção é controlada por quem usa o componente.
 */
export default function AppShell({ navItems, activeId, onNavigate, profile, onLogout, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = navItems.find((item) => item.id === activeId);

  function handleSelect(id) {
    onNavigate(id);
    setMenuOpen(false);
  }

  return (
    <div className="app-shell">
      {menuOpen && (
        <button type="button" className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />
      )}
      <Sidebar
        items={navItems}
        activeId={activeId}
        onSelect={handleSelect}
        profile={profile}
        onLogout={onLogout}
        open={menuOpen}
      />
      <div className="main-shell">
        <Topbar
          sectionLabel={active?.label}
          userName={profile.name}
          menuOpen={menuOpen}
          onOpenMenu={() => setMenuOpen(true)}
        />
        <main className="content">
          {children}
          <footer className="page-foot">
            Helpdesk · Atendimento organizado, do início ao fim.
            <span>{formatLongDate(new Date())}</span>
          </footer>
        </main>
      </div>
    </div>
  );
}
