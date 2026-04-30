# Firebase security setup for Wasi

Apply these settings in Firebase Console before public release.

## Authentication

Enable Email/Password provider.
Require email verification before allowing sensitive actions in future releases.

## Firestore access model

Each user's data must live under:

users/{uid}/...

Only the authenticated owner may read or write these documents.
Do not allow public reads.
Do not allow cross-user access.

Collections used by the app:

- users/{uid}
- users/{uid}/wills
- users/{uid}/guardians
- users/{uid}/debts
- users/{uid}/digitalAssets
- users/{uid}/deathVerifications
- users/{uid}/legacyRequests

## Required rule behavior

- Signed out users: deny all reads and writes.
- Signed in users: allow access only where request.auth.uid equals uid.
- Unknown top-level collections: deny all access.

## Release checklist

- Enable Authentication Email/Password.
- Deploy owner-only Firestore rules.
- Disable test mode.
- Review Storage rules before enabling attachments.
- Add App Check before production launch.
