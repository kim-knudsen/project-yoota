<p align="center">
  <a href="https://yoota.app">
    <img src="https://static-assets-geniebeach.vercel.app/yoota/yoota-readme-logo-01.png" height="162">
  </a>
</p>

## Disclaimer

Full stack pet project built with "the preferred stack" (at the time of writing), featuring:

🌐&nbsp; [Next.js](https://nextjs.org/)<br>
📱&nbsp; [React Native](https://reactnative.dev/)<br>
🔗&nbsp; [tRPC](https://trpc.io/)<br>
🐘&nbsp; [Prisma](https://www.prisma.io/) (PostgreSQL)<br>

Deployed at [Vercel](https://vercel.com/home) 🚀

## Table of Contents

-   [Getting started](#getting-started)
    -   [Install Node dependencies](#install-node-dependencies)
    -   [Build packages](#build-packages)
    -   [Install Docker](#install-docker)
    -   [Launch the backend](#launch-the-backend)
    -   [Running on device](#running-on-device)
    -   [Staging](#staging)
-   [Testing](#testing)
    -   [Unit tests](#unit-tests)
    -   [E2E tests](#e2e-tests)

## Getting Started

### Install Node dependencies

NextAuth [requires Node 16 ATM](https://github.com/nextauthjs/next-auth/issues/4575). So use Node 16 or install dependencies using the `--ignore-engines` flag for now.

```sh
yarn install --ignore-engines
```

The above command should be executed in the root of the monorepo.

You may also run [multiple versions of Node using homebrew](https://apple.stackexchange.com/questions/171530/how-do-i-downgrade-node-or-install-a-specific-previous-version-using-homebrew).

### Build packages

Build the project by running the following command in the root of the monorepo.

```sh
yarn build
```

The above command will run the local build command for all apps and packages.

Note that changes to packages will require a rebuild. This may also be performed from within the specific package folder, e.g.:

```sh
cd packages/db
yarn build
```

### Install Docker

[Docker](https://www.docker.com/products/docker-desktop/) is used to spin up a local Postgres database. Make sure [Docker](https://www.docker.com/products/docker-desktop/) is installed and up and running.

### Launch the backend

Make sure the local Postgres database is up and running by executing the following command.

```sh
yarn db:start
```

The above command will take longer the first time, as Docker needs to fetch the Postgres image.

If this is the first time starting the database, you also wanna run any migrations after the database has launched.

```sh
yarn db:migrate:dev
```

This will create the needed tables by running the migrations contained in the `db` package. It will also seed the database with any relevant test data.

Finally start the web app (containing the API) by running.

```sh
yarn dev
```

### Running on device

Besides running the simulator against `http://localhost:3000`, you may also run the app on a physical device against your local backend. This may require additional configuration.

Add the following entry to the `NSAppTransportSecurity` dictionary defined in `Info.plist`, where `192.168.68.115` is your local IP:

```xml
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSExceptionDomains</key>
	<dict>
		<key>localhost</key>
		<dict>
			<key>NSExceptionAllowsInsecureHTTPLoads</key>
			<true/>
		</dict>
		<key>192.168.68.115</key>
		<dict>
			<key>NSExceptionAllowsInsecureHTTPLoads</key>
			<true/>
		</dict>
	</dict>
</dict>
```

Instruct the app to use your local IP as it's `BASE_URL` in `./apps/mobile/.env`:

```
BASE_URL=http://192.168.68.115:3000
```

Finally, make sure that the `NEXTAUTH_URL_INTERNAL` environment variable is set to the same base URL, for the process running the backend. This can be done by starting the backend using the following command:

```
NEXTAUTH_URL_INTERNAL=http://192.168.68.115:3000 yarn dev
```

Make sure to perform a clean build of the mobile app for the changes to take effect.

### Staging

The staging database (currently hosted at [Supabase](https://supabase.com/)), can be used by running the following command.

```sh
yarn staging
```

It requires a `.env.staging` file at the root of the monorepo - this file should not be known by git.

```sh
YOOTA_DATABASE_URL="postgresql://postgres:**********@db.nilmyfbphfwperdpedfv.supabase.co:5432/postgres"
```

## Testing

### Unit tests

[Jest](https://jestjs.io/) is used as the primary driver for running unit tests. Running the following command will launch the `test` script across all `apps` and `packages`:

```sh
yarn test
```

Not all `packages` have direct units tests (yet), but they will at least run the TypeScript compiler and the linter as part of their `test` script, e.g.:

```sh
{
    "test": "tsc --noEmit && yarn lint"
}
```

### E2E tests

#### Mobile

End-to-end testing foundation (for iOS) has been added, powered by [Detox](https://wix.github.io/Detox/).

To run the test suite locally, navigate to the `mobile` app directory, and start by building a debug build of the app, e.g.:

```sh
cd apps/mobile
yarn build:detox:ios:debug
```

Once complete, start the test suite by running the following:

```sh
yarn test:detox:ios:debug
```

You may target a specific deployment/URL and/or a specific mocked user, by passing in launch arguments via Detox, e.g.:

```sh
detox test --configuration ios.sim.debug --app-launch-args='-base-url https://yoota-o7oipzzam-yoota.vercel.app -mock-user jane' --cleanup
```

#### Web

-   [ ] Add end-to-end testing support using Playwright

## Authentication

### Email

-   [ ] Document

### Google OAuth Provider

-   [ ] Document

### Apple OAuth Provider

-   [ ] Document
