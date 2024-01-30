import createApi from '../api.service';

class RolesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/roles") {
    this.api = createApi(baseUrl);
  }

  async getRoles() {
    return (await this.api.get("/")).data;
  }

  // async changeCategoryStatus(id: string, status: ValidStatus) {
  //   return (await this.api.patch(`/change-status/${status}/${id}`)).data;
  // }

  async deleteRole(id: string) {
    return (await this.api.delete(`/delete/${id}`)).data;
  }

  async getSingleRole(id: string) {
    return (await this.api.get(`/detail/${id}`)).data;
  }

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

  async updateRole(category: any, id: string) {
    return (await this.api.patch(`/edit/${id}`, category)).data;
  }
}

const AdminRolesService = new RolesServiceAdmin();

export default AdminRolesService;
