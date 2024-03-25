import { AccountLoginType, AccountRegisterType } from '../../../../backend/commonTypes'; 
import createApi from '../api.service';

class ClientAuthorizationService {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/auth") {
    this.api = createApi(baseUrl);
  }

  async submitLogin(data: AccountLoginType) {
    return (await this.api.post("/login", data)).data;
  }

  async submitRegister(data: AccountRegisterType) {
    return (await this.api.post("/register", data)).data;
  }

  async logout() {
    return (await this.api.get("/logout")).data;
  }
}

const clientAuthorizationService = new ClientAuthorizationService();

export default clientAuthorizationService;
