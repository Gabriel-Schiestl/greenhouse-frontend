import type { GlpParameters } from "@/format/format";

export class ApiService {
  baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async getAllData() {
    const response = await fetch(this.baseUrl + "/data");

    // Adicionar verificador de status de requisição.
    return response.json();
  }

  async getAllParameters() {
    const response = await fetch(this.baseUrl + "/parameters");
    return response.json();
  }

  async updateParameter(id: number, params: Partial<GlpParameters>) {
    const response = await fetch(`${this.baseUrl}/parameter/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar parâmetros: ${response.status}`);
    }
    return response.json();
  }

  // --- Funções específicas para atualizar parâmetros individuais ---

  // Atuadores
  async setLight(id: number, lightStatus: boolean) {
    return this.updateParameter(id, { turn_on_light: lightStatus });
  }

  async setFan(id: number, fanStatus: boolean) {
    return this.updateParameter(id, { turn_on_ventilation: fanStatus });
  }

  async setIrrigation(id: number, irrigationStatus: boolean) {
    return this.updateParameter(id, { turn_on_irrigation: irrigationStatus });
  }

  // Limites
  async setMaxTemperature(id: number, maxTemperature: number) {
    return this.updateParameter(id, { max_temperature: maxTemperature });
  }

  async setMaxHumidity(id: number, maxHumidity: number) {
    return this.updateParameter(id, { max_humidity: maxHumidity });
  }

  async setMinSoilMoisture(id: number, minSoilMoisture: number) {
    return this.updateParameter(id, { min_soil_moisture: minSoilMoisture });
  }

  async setMinLightLevel(id: number, minLightLevel: number) {
    return this.updateParameter(id, { min_light_level: minLightLevel });
  }
}

export const apiService = new ApiService();
export default ApiService;
