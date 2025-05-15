export default async (ctx, next) => {
    console.log('Global middleware');
    return next();
  };