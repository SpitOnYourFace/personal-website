function requireEnv(name: string): string {
  const value = import.meta.env[name];
  if (!value || value === 'your_api_key_here') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = import.meta.env[name];
  return value && value !== 'your_api_key_here' ? value : undefined;
}

export const env = {
  get CMC_API_KEY() { return requireEnv('CMC_API_KEY'); },
  get SENTRY_DSN() { return optionalEnv('SENTRY_DSN'); },
};
