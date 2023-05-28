## Description

This bot works in pair with [Anki Reference Addon](https://github.com/glebmark/anki-reference-addon)

add terminology, what is title, definition, example
## Development - Running the app without Docker

### Clone repo and create .env file
```bash
# clone repo
git clone https://github.com/glebmark/anki-reference-bot.git
# copy env file
cp .env.example .env
```

### Set envs 
#### Telegram
- [create Telegram bot](https://core.telegram.org/bots/features#creating-a-new-bot) and obtain bot token, set to BOT_TOKEN
- in order to save money as Google's Text-To-Speech costs $$$, you could restrict usage of TTS to one particular user: find out your User ID, for example call /start within @userinfobot bot in Telegram, and set id to TEST_USER
#### App
- set in AMOUNT_OF_EXAMPLES desired amount of examples per definition, some definitions could have a lot of them (2-3 should be enough)
#### Database
- change POSTGRES_USER, POSTGRES_PASSWORD and POSTGRES_DB
- change user, password and db name in DB_URL accordingly to previous step
#### Google Cloud
- create account in Google Cloud
- activate Text-To-Speech in Products section
- add [Service Account Key](https://cloud.google.com/docs/authentication/application-default-credentials#GAC)
- download google_cloud_key.json, set it's location to GOOGLE_APPLICATION_CREDENTIALS
#### AWS
- create account in Amazon's AWS

- setup S3 bucket
- set name to S3_BUCKET_NAME, region to AWS_REGION

- add User in IAM
- grant AmazonS3FullAccess in Permissions policies of added User
- create Access Key in Security Credentials of added User
- set key to AWS_ACCESS_KEY, secret to AWS_SECRET_ACCESS_KEY


### Start app
```bash
$ npm run ci

# development
$ npm run start

# watch mode
$ npm run dev
```

## Deployment

_This method suitable only for personal use on VPS, do not use it for production (see "TODO - Proper CI/CD" section below)._

Set env variables in .env (see section "Set envs" above).

Connect to VPS via SSH and run as follows:
```bash
$ git clone https://github.com/glebmark/anki-reference-bot.git
```
Then run locally:
```bash
# copy your google_cloud_key.json
$ scp -P <port_number> google_cloud_key.json <user_name>@<ip_address>:/root/anki-reference-bot
# copy .env file with envs which have been set previously
$ scp -P <port_number> .env <user_name>@<ip_address>:/root/anki-reference-bot
```
Then run on VPS:
Connect back to VPS and run:
```bash
docker compose build
docker compose up --detach
```
## TODO
### Proper CI/CD
For further development use proper way for deployment of images and envs:
- in docker-compose.yml remove loading envs from .env, add envs separatly and also set them at cloud provider, for example App in Digital Ocean or Dyno in Heroku
- add Container Registry, for example on Docker Hub
- setup Github Action for building and pushing docker images to [Docker Hub](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)
- deploy [webhook](https://github.com/adnanh/webhook) to VPS, setup endpoint which executes script, which pulls updated images from Docker Hub
- add a job which evokes this endpoint after publishing new images