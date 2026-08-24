pnpm init
add express cors dotenvbcryptjsjsonwebtokensocket.io zod
pnpm add -D typescript ts-node-dev @types/express @types/node @types/cors @types/bcryptjs
pnpm add prisma--save-dev
pnpm  add @prisma/client
npx tsc--init
npx prisma init

Minimalapps/api/src/index.ts:

app.get("/health",(_req,res)=> res.json({ok:true }))

Connect Prisma to DB