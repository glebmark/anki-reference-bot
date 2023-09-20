## Description

Anki Reference Bot is a service which helps with language learning by automating of creation of [Anki](https://apps.ankiweb.net) flash cards. It allows add new words through Telegram bot and parse definitions and examples from dictionaries like Cambridge Dictionary and generating text-to-speech with Google Cloud's neural network as well.

Currently supported only English and French languages.

This service works together with [Anki Reference Addon](https://github.com/glebmark/anki-reference-addon)

## Terminology
- word: it's what user type in Telegram bot, for example "get along"
- title: it's what service parse from dictionaries. There could be many titles corresponding to typed in word, in this example only one's been parsed - "get along"
- definition: each title could have multiple definitions, like "If two or more people get along..."
- example: each definition could have multiple examples, like "I wonder how Michael is..."
- part of speech: in this example it would be phrasal verb
## Development - Running the app without Docker

### Clone repo and create .env file:
```bash
# clone repo
git clone https://github.com/glebmark/anki-reference-bot.git
# copy env file
cp .env.example .env
```

### Set environment variables:
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


### Start app:
```bash
# install deps
$ npm run ci

# run app
$ npm run start

# watch mode
$ npm run dev
```

## Deployment

_This method suitable only for personal use on VPS, do not use it for production (see TODO section below for proper CI/CD)._

Set env variables in .env (see section "Set envs" above).

Connect to VPS via SSH and run as follows:
```bash
$ git clone https://github.com/glebmark/anki-reference-bot.git
```
Then run locally:
```bash
# copy your google_cloud_key.json
$ scp -P <port_number> google_cloud_key.json <user_name>@<ip_address>:/root/anki-reference-bot
# copy .env file with envs (see "Set envs" section above)
$ scp -P <port_number> .env <user_name>@<ip_address>:/root/anki-reference-bot
```
Connect back to VPS and run:
```bash
docker compose build
docker compose up --detach
```
## TO DO
- in docker-compose.yml remove loading envs from .env, add envs separatly and also set them at cloud provider, for example App in Digital Ocean or Dyno in Heroku
- add Container Registry, for example on Docker Hub
- setup Github Action for building and pushing docker images to [Docker Hub](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)
- deploy [webhook](https://github.com/adnanh/webhook) to VPS, setup endpoint which executes script, which pulls updated images from Docker Hub
- add a job which evokes this endpoint after publishing new images