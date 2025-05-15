export const appRouter = {
  hello: {
    input: (input) => input,
    resolve: ({ input }) => ({ greeting: 'Hello, ' + (input?.name || 'world') + '!' }),
  },
};
