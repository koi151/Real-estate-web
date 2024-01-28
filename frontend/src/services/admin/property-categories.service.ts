import createApi from '../api.service';
import { GetPropertiesOptions, ValidStatus } from '../../../../backend/commonTypes';

class PropertyCategoriesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin/property-categories") {
    this.api = createApi(baseUrl);
  }

  async getPropertyCategories(options: GetPropertiesOptions) {
    return (await this.api.get("/", { params: options })).data;
  }

  async changeCategoryStatus(id: string, status: ValidStatus) {
    return (await this.api.patch(`/change-status/${status}/${id}`)).data;
  }

  async deleteCategory(id: string) {
    return (await this.api.delete(`/delete/${id}`)).data;
  }

  async getSingleCategory(id: string) {
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

  async updateCategory(category: any, id: string) {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return (await this.api.patch(`/edit/${id}`, category, config)).data;
  }
}

const propertyCategoriesService = new PropertyCategoriesServiceAdmin();

export default propertyCategoriesService;
