import { colToList } from './utils/modeling';

const displayFirstSticke = list => list && list.length > 0
    ? list.map((x, i) => ({ ...x, isDisplayed: i === 0 }))
    : [];

const getNotes = () => fetch('/api/notes')
    .then(data => data.json())
    .then(data => data.notes)
    .then(displayFirstSticke)
    .catch(console.error);

const updateAllDB = data => fetch('/api/notes', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
});

const updateOneDB = stickie => fetch(`/api/notes/${stickie.quillID}`, {
    method: 'PUT',
    body: JSON.stringify(stickie),
    headers: { 'Content-Type': 'application/json' }
});

const authenticate = () => fetch('/auth/authenticate')
    .then(user => user.json())
    .catch(console.error);

const logout = (cb) => fetch('/auth/logout')
    .then(() => cb());

export {
    getNotes,
    updateAllDB,
    updateOneDB,
    authenticate,
    logout,
}