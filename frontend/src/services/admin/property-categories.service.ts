import createApi from '../api.service';
import { GetPropertiesOptions } from '../../../../backend/commonTypes';

class PropertyCategoriesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/property-categories") {
    console.log("baseUrl:", baseUrl);
    this.api = createApi(baseUrl);
  }

  async getPropertyCategories(options: GetPropertiesOptions) {
    return (await this.api.get("/", { params: options })).data;
  }

  // async changePropertyStatus(id: string, status: ValidStatus) {
  //   return (await this.api.patch(`/change-status/${status}/${id}`)).data;
  // }

  // async getSingleProperty(id: string) {
  //   return (await this.api.get(`/detail/${id}`)).data;
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
  //   const config = {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   };
  //   return (await this.api.patch(`/edit/${id}`, property, config)).data;
  // }
}

const propertyCategoriesService = new PropertyCategoriesServiceAdmin();

export default propertyCategoriesService;
