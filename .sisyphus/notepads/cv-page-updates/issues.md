# Issues

- Browser-native print headers/footers cannot be guaranteed removed by app code; only app-rendered printable content can be controlled.
- Admin visibility should be computed server-side and passed into the client shell as a prop; do not read env allowlist directly in the client.
- Verification caught a Server Component serialization issue on `/en/cv`: the Mongo-backed `cv` payload still needed explicit JSON serialization before being passed into `CVPageShell`, even after `.lean()`.
