import Avatar from '@/components/ui/Avatar';
import { formatDateTime } from '@/utils/formatters';

export default function TicketComments({ comments = [] }) {
  return (
    <section className="conversation" aria-labelledby="conversation-title">
      <div className="conversation-head">
        <h3 id="conversation-title">CONVERSA</h3>
        <span>
          {comments.length}
          <span className="sr-only"> comentários</span>
        </span>
      </div>

      {comments.length === 0 ? (
        <div className="no-comments">Ainda não há comentários nesta solicitação.</div>
      ) : (
        <ul className="comment-list">
          {comments.map((item) => (
            <li className="comment" key={item.id}>
              <Avatar small name={item.user?.name} />
              <div>
                <header>
                  <strong>{item.user?.name || 'Usuário'}</strong>
                  <time dateTime={item.created_at}>{formatDateTime(item.created_at)}</time>
                </header>
                <p>{item.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
