export const success = (res: any, data: unknown, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

export const fail = (res: any, message: string, status: number) => {
  return res.status(status).json({
    success: false,
    error: message,
  });
};
