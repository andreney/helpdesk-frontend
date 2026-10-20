import { useId, useState } from 'react';
import Brand from '@/components/ui/Brand';
import Button from '@/components/ui/Button';
import ErrorMessage from '@/components/ui/ErrorMessage';
import Icon from '@/components/ui/Icon';
import { getErrorMessage } from '@/services/httpClient';
import { useAuth } from './useAuth';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const emailId = useId();
  const passwordId = useId();

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login({ email: email.trim(), password });
    } catch (issue) {
      setError(getErrorMessage(issue));
      setBusy(false);
    }
    // Em caso de sucesso este componente é desmontado, então não há estado a restaurar.
  }

  return (
    <main className="login-layout">
      <section className="login-form-side">
        <div className="login-box">
          <Brand />
          <div className="login-heading">
            <p className="eyebrow">CENTRAL DE SUPORTE</p>
            <h1>Bom ter você por aqui.</h1>
            <p>Entre na sua conta para acompanhar e resolver solicitações.</p>
          </div>

          <form className="stack" onSubmit={handleSubmit}>
            <label htmlFor={emailId}>
              E-mail
              <input
                id={emailId}
                type="email"
                autoComplete="username"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label htmlFor={passwordId}>
              Senha
              <input
                id={passwordId}
                type="password"
                autoComplete="current-password"
                placeholder="Sua senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            <ErrorMessage>{error}</ErrorMessage>

            <Button type="submit" fullWidth disabled={busy} icon="arrow-right">
              {busy ? 'Entrando…' : 'Entrar na plataforma'}
            </Button>
          </form>

          <p className="login-footnote">Acesso protegido pela autenticação da Helpdesk API.</p>
        </div>
      </section>

      <aside className="login-art" aria-hidden="true">
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="art-copy">
          <span className="art-icon">
            <Icon name="asterisk" />
          </span>
          <h2>Suporte que acompanha o ritmo do seu time.</h2>
          <p>Organize solicitações, acompanhe cada etapa e mantenha as conversas em um só lugar.</p>
        </div>
        <div className="art-foot">
          <i /> Plataforma de atendimento Helpdesk
        </div>
      </aside>
    </main>
  );
}
