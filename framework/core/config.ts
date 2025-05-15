// Config loader for framework and plugins
export type FrameworkConfig = {
  apiDir?: string;
  tcpDir?: string;
  plugins?: any[];
  [key: string]: any;
};

export function loadConfig(): FrameworkConfig {
  // TODO: Load config from file or environment
  return {
    apiDir: 'src/routes',
    tcpDir: 'src/tcp',
    plugins: [],
  };
} 