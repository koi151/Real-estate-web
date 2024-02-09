import createApiAdmin from "../api.service";

class AdminAuthorizationService {

  constructor(baseUrl = "http://localhost:3000/api/admin/auth") {
    this.api = createApiAdmin(baseUrl);
  }

  async submitLogin(data) {
    return (await this.api.post("/login", data)).data;
  }

  async logOut(data) {
    return (await this.api.get("/logout", data)).data;
  }
}

const adminAuthorizationService = new AdminAuthorizationService();

export default adminAuthorizationService;
