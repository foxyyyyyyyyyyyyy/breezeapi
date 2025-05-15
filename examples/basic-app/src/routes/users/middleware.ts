export default async (ctx, next) => {
    console.log('User middleware');
    return next();
  };