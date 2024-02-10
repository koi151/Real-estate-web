import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const sign = promisify(jwt.sign).bind(jwt);

export const generateToken = async (
  payload: any,
  secretSignature: string,
  tokenLife: string
): Promise<string | null> => {
  try {
    return await sign(
      {
        payload,
      },
      secretSignature,
      {
        algorithm: 'HS256',
        expiresIn: tokenLife,
      }
    ) as string;
  } catch (error) {
    console.log(`Error in generate access token: ${error}`);
    return null;
  }
};
