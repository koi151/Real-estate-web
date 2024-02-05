import createApi from '../api.service';
import { AdminAccountType } from '../../../../backend/commonTypes';

class AccountsServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/accounts") {
    this.api = createApi(baseUrl);
  }

  // options: AdminAccountType
  // , { params: options }
  async getAccounts() {
    return (await this.api.get("/")).data;
  }

  // async getSingleProperty(id: string) {
  //   return (await this.api.get(`/detail/${id}`)).data;
  // }

  // async changePropertyStatus(id: string, status: ValidStatus) {
  //   return (await this.api.patch(`/change-status/${status}/${id}`)).data;
  // }

  // async multiChangeProperties(ids: string[], type: ValidMultiChangeType) {
  //   return (await this.api.patch(`/multi-change`, {ids, type})).data;
  // }

  // async createProperty(property: any) {
  //   const config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };
  //   return (await this.api.post('/create', property, config)).data;
  // }

  // async updateProperty(property: any, id: string) {
  //   console.log("property:", property, id)
  //   const config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };
  //   return (await this.api.patch(`/edit/${id}`, property, config)).data;
  // }

  async deleteAccount(id: string) {
    return (await this.api.delete(`/delete/${id}`)).data;
  }
}

const adminAccountsService = new AccountsServiceAdmin();

export default adminAccountsService;
