import { Request, Response } from 'express';

export const getDummyData = (req: Request, res: Response) => {
  res.json({ message: 'Dummy data', values: [1, 2, 3, 4] });
};
