import { AccountLoginType } from "../../../../backend/commonTypes";
import createApi from '../api.service';

class AdminAuthorizationService {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/auth") {
    this.api = createApi(baseUrl);
  }

  async submitLogin(data: AccountLoginType) {
    return (await this.api.post("/login", data)).data;
  }

  async logout() {
    return (await this.api.get("/logout")).data;
  }
}

const adminAuthorizationService = new AdminAuthorizationService();

export default adminAuthorizationService;
