import { Hono } from 'hono';
import type { AppBindings } from './env';
import { attachUser } from './middleware/auth';
import { chohaeCors } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/error';
import auth from './routes/auth';
import me from './routes/me';
import tracks from './routes/tracks';
import lyrics from './routes/lyrics';
import albums from './routes/albums';
import uploads from './routes/uploads';
import generation from './routes/generation';
import users from './routes/users';
import { ok } from './lib/response';

const app = new Hono<AppBindings>();

app.use('*', async (c, next) => {
  c.set('requestId', crypto.randomUUID());
  await next();
});
app.use('*', chohaeCors());
app.use('*', attachUser);
app.onError(errorHandler);
app.notFound(notFoundHandler);

app.get('/health', (c) => ok(c, { status: 'ok', timestamp: new Date().toISOString() }));
app.route('/auth', auth);
app.route('/me', me);
app.route('/tracks', tracks);
app.route('/lyrics', lyrics);
app.route('/albums', albums);
app.route('/uploads', uploads);
app.route('/generation', generation);
app.route('/users', users);

export default app;
