import { Component } from 'react';

/** Evita a "tela branca": captura erros de renderização e oferece recarregar a página. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Erro inesperado na interface:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="login-layout">
        <section className="login-form-side">
          <div className="login-box" role="alert">
            <h1>Algo deu errado.</h1>
            <p>Ocorreu um erro inesperado ao exibir esta página. Recarregue para tentar novamente.</p>
            <button type="button" className="button button-primary" onClick={() => window.location.reload()}>
              Recarregar página
            </button>
          </div>
        </section>
      </main>
    );
  }
}
