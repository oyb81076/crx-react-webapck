import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { Configuration } from 'webpack';

const COMPRESS = process.env.COMPRESS === 'true';

const config: Configuration = {
  target: 'web',
  mode: 'production',
  optimization: { minimize: COMPRESS, splitChunks: false },
  performance: { hints: false },
  entry: {
    popup: './src/popup.tsx',
    background: './src/background.ts',
    page: './src/page.ts',
  },
  output: {
    publicPath: '/dist/',
  },
  resolve: {
    extensionAlias: { '.js': ['.tsx', '.ts', '.js'] },
    alias: { '~': __dirname + '/src' },
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new HtmlWebpackPlugin({
      template: 'public/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
      inject: 'body',
      minify: COMPRESS,
    }),
  ],
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'sass-loader',
        ],
      },
      {
        test: /.tsx?$/,
        loader: 'swc-loader',
        options: {
          jsc: {
            target: 'esnext',
            parser: { syntax: 'typescript', tsx: true, dynamicImport: false },
            transform: { react: { runtime: 'automatic', development: false } },
          },
        },
      },
    ],
  },
};
export default config;
