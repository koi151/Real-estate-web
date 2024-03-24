import { DepositOrderType } from '../../../../backend/commonTypes';
import createApi from '../api.service';

class OrderService {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/order") {
    this.api = createApi(baseUrl);
  }

  private async handleRequest(request: Promise<any>) {
    try {
      const response = await request;
      return response.data;
    } catch (err: any) {
      if (err.status === 401) {
        throw new Error('Unauthorized: Please log in to access this feature.');
      } else {
        console.error('An error occurred:', err);
        throw new Error('An unexpected error occurred. Please try again later.');
      }
    }
  }

  async createPaymentUrlVnPay(data: DepositOrderType) {
    const request = this.api.post(`/deposit/vnpay/create-payment-url`, data);
    return this.handleRequest(request);
  }
}

const orderService = new OrderService();

export default orderService;