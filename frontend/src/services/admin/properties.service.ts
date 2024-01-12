import createApi from '../api.service';
import { GetPropertiesOptions } from '../../commonTypes';

class PropertiesServiceAdmin {
  private api: any; 

  constructor(baseUrl = "http://localhost:3000/api/v1/admin") {
    this.api = createApi(baseUrl);
  }

  async getProperties(options: GetPropertiesOptions) {
    return (await this.api.get("/properties", { params: options })).data;
  }
}

const propertiesService = new PropertiesServiceAdmin();

export default propertiesService;
