# Sticky Notes

## Description
Take notes in a rich text editor, [https://www.stickynote.app](https://www.stickynote.app).

## Download and develop
* The app is using Google oAuth which need credentials. You can create them from [Google Credentials](https://console.developers.google.com/apis/credentials).
* When the credentials are created, download sticky_note by running:
```bash
git clone https://github.com/pontussandberg/sticky-note.git
```
In `sticky_note/server` create a file called .env and add the following keys:
```
GOOGLE_CLIENT_ID=<Insert Google client ID>
GOOGLE_CLIENT_SECRET=<Insert Google client secret>
COOKIE_ENCRYPT_KEY=<Write any random string here (example: diqwj123fkla))>
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
```
* Start the app by running this inside the project root:
```bash
npm run start-local
```
* The app can now be visited on localhost:8080
