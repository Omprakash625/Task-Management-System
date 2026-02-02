export const getParam = (param: string | string[] | undefined): string => {
  if (!param) throw new Error('Missing route parameter');
  return Array.isArray(param) ? param[0] : param;
};

export default getParam;