import mongoose from 'mongoose';

export const connect = async (): Promise<void> => {
  try {
    const mongoURL: string = process.env.MONGO_URL!;
    await mongoose.connect(mongoURL);
    console.log('Connect successful')
  } catch (error) {
    console.log('CONNECT ERROR!', error)
  }
}
