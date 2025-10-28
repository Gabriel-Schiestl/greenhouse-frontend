import type { GlpParameters } from "@/format/format";

export class ApiService {
    baseUrl = "http://localhost:8080";

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
            body: JSON.stringify(params)
        });
        if (!response.ok) {
            throw new Error(`Erro ao atualizar parâmetros: ${response.status}`);
        }
        return response.json();
    }

    async setLight(id: number, lightStatus: boolean) {
        return this.updateParameter(id, { turn_on_light: lightStatus });
    }
}

export const apiService = new ApiService();
export default ApiService;