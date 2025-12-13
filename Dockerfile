FROM node:24.5-alpine AS base

FROM base AS deps

WORKDIR /app

ENV BUILD_TARGET=production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm

COPY package.json package-lock.json* pnpm-lock.yaml* ./

RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app

ENV BUILD_TARGET=production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG APP_HOST_URL
ENV APP_HOST_URL=${APP_HOST_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN sh create_build_info.sh

RUN corepack enable pnpm && pnpm run build --webpack

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]