export class ApiService {
    baseUrl = "http://localhost:8080";

    async getAllData() {
        const response = await fetch(this.baseUrl + "/data");
        return response.json();
    }
}

export const apiService = new ApiService();
export default ApiService;