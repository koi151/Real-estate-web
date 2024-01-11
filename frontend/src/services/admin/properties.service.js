import createApi from '../api.service';

class PropertiesServiceAdmin {

  constructor(baseUrl = "http://localhost:3000/api/v1/admin") {
    this.api = createApi(baseUrl);
  }

  async getProperties(option = {}) {
    return (await this.api.get("/properties", option)).data;
  }

}

const propertiesService = new PropertiesServiceAdmin();

export default propertiesService;