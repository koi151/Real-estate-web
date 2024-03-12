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

export const verifyToken = async (token: string, secretKey: string): Promise<any | null> => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.log(`Error in verify access token: ${error}`);
    throw new Error('Authorization failed');
  }
};

export const decodeToken = async (token: string, secretKey: string) => {
	try {
		return jwt.verify(token, secretKey, {
			ignoreExpiration: true,
		});
	} catch (error) {
		console.log(`Error in decode access token: ${error}`);
		return null;
	}
};