# Sticky Note

Take notes in a rich text editor, [stickynote.app](https://www.stickynote.app).
## Technologies
* NodeJS
* Express
* React
* MongoDB
* QuillJS

## Download and develop
* The app is using Google oAuth which need credentials. You can create them from [Google Credentials](https://console.developers.google.com/apis/credentials).
* When the credentials are created, download sticky_note by running:
```bash
git clone https://github.com/pontussandberg/sticky-note.git
```
In `sticky_note/server` create a file called `.env` and add the following keys:
```
GOOGLE_CLIENT_ID=<Insert Google client ID>
GOOGLE_CLIENT_SECRET=<Insert Google client secret>
COOKIE_ENCRYPT_KEY=<Write any random string here (example: diqwj123fkla))>

GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
MONGO_URI=mongodb://localhost:27017
```
* Run `docker-compose up` in the project root to start the MongoDB in a docker container.
* Start the app by running `npm run start-local` inside the project root.
* The app can now be visited on `localhost:8080`
