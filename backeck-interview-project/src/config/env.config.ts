export const env = {
    nodeENV: process.env.APP_ENV ?? 'development',
    portENV: Number(process.env.APP_PORT ?? 8080),
    databaseENV: process.env.DATABASE_URL as string,
}