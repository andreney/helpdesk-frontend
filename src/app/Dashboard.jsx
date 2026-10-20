import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useAuth } from '@/features/auth/useAuth';
import { TICKET_SCOPES } from '@/features/tickets/constants';
import TicketsPage from '@/features/tickets/TicketsPage';

const NAV_ITEMS = [
  { id: TICKET_SCOPES.ALL, label: 'Visão geral', icon: 'grid' },
  { id: TICKET_SCOPES.MINE, label: 'Meus chamados', icon: 'list' },
];

/** Área autenticada: monta o layout e escolhe o escopo exibido. */
export default function Dashboard() {
  const { user, roleLabel, logout } = useAuth();
  const [scope, setScope] = useState(TICKET_SCOPES.ALL);

  return (
    <AppShell
      navItems={NAV_ITEMS}
      activeId={scope}
      onNavigate={setScope}
      profile={{ name: user?.name, subtitle: roleLabel }}
      onLogout={logout}
    >
      <TicketsPage scope={scope} />
    </AppShell>
  );
}
