"use client"

import { useEffect, useState } from "react"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Activity, Lightbulb, Fan, Thermometer, Droplets } from "lucide-react"

import { GlpData, GlpParameters } from "@/format/format"
import { apiService } from "@/services/service"

// Mock data generators
const transformDataForChart = (data: GlpData[], field: keyof GlpData) => {
  return data.map(item => ({
    time: new Date(item.created_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Number(item[field]) || 0,
  })).slice(-20);
}

export default function IoTDashboard() {

  // --- Atuadores e Limites de Controle ---
  // Light
  const [lightOn, setLightOn] = useState(false)
  const [lightLoading, setLightLoading] = useState(false)

  // Fan / Ventilation
  const [fanOn, setFanOn] = useState(false)
  const [fanLoading, setFanLoading] = useState(false)

  // Irrigation
  const [irrigationOn, setIrrigationOn] = useState(false)
  const [irrigationLoading, setIrrigationLoading] = useState(false)

  // --- Limites ---
  const [tempThreshold, setTempThreshold] = useState("25")
  const [tempLoading, setTempLoading] = useState(false)

  const [humidityThreshold, setHumidityThreshold] = useState("60")
  const [humidityLoading, setHumidityLoading] = useState(false)

  const [soilThreshold, setSoilThreshold] = useState("40")
  const [soilLoading, setSoilLoading] = useState(false)

  const [lightThreshold, setLightThreshold] = useState("200")
  const [lightThresholdLoading, setLightThresholdLoading] = useState(false)

  const [sensorData, setSensorData] = useState<GlpData[]>([])

  // Alterar para fazer somente ser um registro ao invés de all
  const [sensorParameters, setSensorParameters] = useState<GlpParameters[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Função para buscar dados da API
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getAllData();
      setSensorData(response.data || []);
      setLastUpdate(new Date())
      console.log("Dados atualizados:", new Date().toLocaleTimeString())
    } catch (err) {
      console.error("Erro ao buscar dados: ", err);
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar parâmetros da API
  const fetchParameters = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getAllParameters();
      setSensorParameters(response.data || []);

      if (response.data && response.data.length > 0) {
        const p = response.data[0];
        setLightOn(p.turn_on_light);
        setFanOn(p.turn_on_ventilation);
        setTempThreshold(String(p.max_temperature));
        setHumidityThreshold(String(p.max_humidity));
      }
      console.log("Parametros atualizados: ", new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Erro ao buscar parâmetros: ", err);
    } finally {
      setIsLoading(false);
    }
  }


  // Handlers
  // Light Handler
  const handleLightToggle = async (newState: boolean) => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    setLightLoading(true);
    try {

      await apiService.setLight(paramId, newState);
      setLightOn(newState);
      await fetchParameters();

      console.log(`Luz atualizada para: ${newState}`);
    } catch (err) {
      console.log(`Erro ao atualizar luz: ${err}`);
    } finally {
      setLightLoading(false);
    }

  }

  // Fan Handler
  const handleFanToggle = async (newState: boolean) => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    setFanLoading(true);
    try {

      await apiService.setFan(paramId, newState);
      setFanOn(newState);
      await fetchParameters();

      console.log(`Ventilação atualizada para: ${newState}`);
    } catch (err) {
      console.log(`Erro ao atualizar ventilação: ${err}`);
    } finally {
      setFanLoading(false);
    }

  }

  const handleIrrigationToggle = async (newState: boolean) => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    setIrrigationLoading(true);
    try {

      await apiService.setIrrigation(paramId, newState);
      setIrrigationOn(newState);
      await fetchParameters();

      console.log(`Irrigação atualizada para: ${newState}`);
    } catch (err) {
      console.log(`Erro ao atualizar irrigação: ${err}`);
    } finally {
      setIrrigationLoading(false);
    }

  }

  const handleSetMaxTemperature = async () => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    const value = parseFloat(tempThreshold);
    if (Number.isNaN(value)) {
      console.warn("Valor de temperatura inválido.");
      return;
    }

    setTempLoading(true);
    try {

      await apiService.setMaxTemperature(paramId, value);
      await fetchParameters();

      console.log(`Temperatura máxima atualizada para: ${value}`);
    } catch (err) {
      console.log(`Erro ao atualizar temperatura máxima: ${err}`);
    } finally {
      setTempLoading(false);
    }

  }

  const handleSetMaxHumidity = async () => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    const value = parseFloat(humidityThreshold);
    if (Number.isNaN(value)) {
      console.warn("Valor de umidade inválido.");
      return;
    }

    setHumidityLoading(true);
    try {

      await apiService.setMaxHumidity(paramId, value);
      await fetchParameters();

      console.log(`Umidade máxima atualizada para: ${value}`);
    } catch (err) {
      console.log(`Erro ao atualizar umidade máxima: ${err}`);
    } finally {
      setHumidityLoading(false);
    }

  }

  const handleSetMinLight = async () => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    const value = parseFloat(lightThreshold);
    if (Number.isNaN(value)) {
      console.warn("Valor de luz inválido.");
      return;
    }

    setLightThresholdLoading(true);
    try {

      await apiService.setMinLightLevel(paramId, value);
      await fetchParameters();

      console.log(`Nível mínimo de luz atualizado para: ${value}`);
    } catch (err) {
      console.log(`Erro ao atualizar nível mínimo de luz: ${err}`);
    } finally {
      setLightThresholdLoading(false);
    }

  }

  const handleSetMinSoil = async () => {
    if (sensorParameters.length === 0) {
      console.warn("Nenhum parâmetro de sensor disponível para atualizar.");
    }

    const paramId = sensorParameters[0].id;
    const value = parseFloat(soilThreshold);
    if (Number.isNaN(value)) {
      console.warn("Valor de umidade do solo inválido.");
      return;
    }

    setSoilLoading(true);
    try {

      await apiService.setMinSoilMoisture(paramId, value);
      await fetchParameters();

      console.log(`Umidade mínima do solo atualizada para: ${value}`);
    } catch (err) {
      console.log(`Erro ao atualizar umidade mínima do solo: ${err}`);
    } finally {
      setSoilLoading(false);
    }

  }

  useEffect(() => {

    fetchData();
    fetchParameters();

    const interval = setInterval(() => {
      fetchData();
      fetchParameters();
    }, 60000); // 1 minuto

    return () => clearInterval(interval);
  }, []);

  // Data
  const temperatureData = transformDataForChart(sensorData, 'temperature');
  const humidityData = transformDataForChart(sensorData, 'humidity');
  const lightLevelData = transformDataForChart(sensorData, 'light_level');
  const soilMoistureData = transformDataForChart(sensorData, 'soil_moisture');

  const currentData = sensorData[sensorData.length - 1];

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard GreenHouse</h1>
            <p className="text-muted-foreground">
              Monitoramento e controle em tempo real
              {lastUpdate && (
                <span className="ml-2 text-xs">
                  (Última atualização: {lastUpdate.toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Status dos Sensores</CardTitle>
            <CardDescription className="text-muted-foreground space-y-2">
              <div>Dados atualizados automaticamente a cada 1 minuto</div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sensorData.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum dado disponível</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">
                    {currentData ? `${currentData.temperature.toFixed(1)}°C` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Temperatura</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-2">
                    {currentData ? `${currentData.humidity.toFixed(1)}%` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Umidade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">
                    {currentData ? `${currentData.light_level.toFixed(0)} lux` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Luz</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {currentData ? `${currentData.soil_moisture.toFixed(1)}%` : '--'}
                  </div>
                  <div className="text-sm text-muted-foreground">Umidade Solo</div>
                </div>
              </div>
            )}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Total de registros: {sensorData.length}
              {lastUpdate && (
                <span className="ml-4">
                  Próxima atualização em: <CountdownTimer />
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Control Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Controles</CardTitle>
            <CardDescription className="text-muted-foreground space-y-2">
              <div>Painel Dispositivos IoT e Limites</div>

              <div>
                {
                  sensorParameters.map(
                    d => (
                      <div key={d.id}>
                        <p className="font-bold">Device: {d.sensor_id}</p>
                        <p className="font-bold">Light: {d.turn_on_light ? "True" : "False"}</p>
                      </div>
                    )
                  )
                }
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col w-full space-y-4">
              {/* Controls (top) */}
              <div className="flex w-full flex-wrap gap-4 justify-center">
              {/* Light Control */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className={`h-5 w-5 ${lightOn ? "text-chart-3" : "text-muted-foreground"}`} />
                  <Label htmlFor="light-switch" className="text-sm font-medium text-foreground">
                  Luz
                  </Label>
                </div>
                <Switch
                  id="light-switch"
                  checked={lightOn}
                  onCheckedChange={handleLightToggle}
                  disabled={lightLoading || sensorParameters.length === 0}
                />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                Status: {lightLoading ? "Atualizando" : (lightOn ? "ON" : "OFF")}
                </p>
              </div>

              {/* Fan Control */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Fan className={`h-5 w-5 ${fanOn ? "text-chart-2" : "text-muted-foreground"}`} />
                  <Label htmlFor="fan-switch" className="text-sm font-medium text-foreground">
                  Fan
                  </Label>
                </div>
                <Switch
                  id="fan-switch"
                  checked={fanOn}
                  onCheckedChange={handleFanToggle}
                  disabled={fanLoading || sensorParameters.length === 0}
                />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                Status: {fanLoading ? "Atualizando" : (fanOn ? "ON" : "OFF")}
                </p>
              </div>

              {/* Irrigation Control */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className={`h-5 w-5 ${sensorParameters[0]?.turn_on_irrigation ? "text-chart-1" : "text-muted-foreground"}`} />
                  <Label htmlFor="irrigation-switch" className="text-sm font-medium text-foreground">
                  Irrigação
                  </Label>
                </div>
                <Switch
                  id="irrigation-switch"
                  checked={irrigationOn}
                  onCheckedChange={handleIrrigationToggle}
                  disabled={irrigationLoading || sensorParameters.length === 0}
                />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                Status: {irrigationLoading ? "Atualizando" : (irrigationOn ? "ON" : "OFF")}
                </p>
              </div>
              </div>

              {/* Thresholds (centered, bottom) */}
              <div className="flex w-full flex-wrap gap-4 justify-center">

              {/* Temperature Threshold */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-chart-4" />
                <Label htmlFor="temp-threshold" className="text-sm font-medium text-foreground">
                  Temperatura Limite
                </Label>
                </div>
                <div className="mt-3 flex items-center gap-2">
                <Input
                  id="temp-threshold"
                  type="number"
                  value={tempThreshold}
                  onChange={(e) => setTempThreshold(e.target.value)}
                  className="h-10 bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">°C</span>
                </div>
              </div>

              {/* Humidity Threshold */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-chart-2" />
                <Label htmlFor="humidity-threshold" className="text-sm font-medium text-foreground">
                  Umidade Limite
                </Label>
                </div>
                <div className="mt-3 flex items-center gap-2">
                <Input
                  id="humidity-threshold"
                  type="number"
                  value={humidityThreshold}
                  onChange={(e) => setHumidityThreshold(e.target.value)}
                  className="h-10 bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              
              {/* Aqui */}
              <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-chart-2" />
                <Label htmlFor="soil-threshold" className="text-sm font-medium text-foreground">
                  Umidade Mínima do Solo
                </Label>
                </div>
                <div className="mt-3 flex items-center gap-2">
                <Input
                  id="soil-threshold"
                  type="number"
                  value={soilThreshold}
                  onChange={(e) => setSoilThreshold(e.target.value)}
                  className="h-10 bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>

                <div className="flex-1 min-w-[220px] rounded-lg border border-border bg-muted/30 p-6">
                  <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-chart-3" />
                <Label htmlFor="light-threshold" className="text-sm font-medium text-foreground">
                  Iluminação Mínima
                </Label>
                </div>
                <div className="mt-3 flex items-center gap-2">
                <Input
                  id="light-threshold"
                  type="number"
                  value={lightThreshold}
                  onChange={(e) => setLightThreshold(e.target.value)}
                  className="h-10 bg-background text-foreground"
                />
                <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
              </div>
            </div>

            
            {/* Falta alteração e deixar funcional */}
            <div className="mt-4 flex gap-3">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleSetMaxHumidity || handleSetMaxTemperature || handleSetMinSoil || handleSetMinLight}
                disabled={humidityLoading || tempLoading || soilLoading || lightLoading || sensorParameters.length === 0}
                >Aplicar Alterações</Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                Resetar para o Padrão
              </Button>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  onClick={fetchData}
                  size="sm"
                  disabled={isLoading}
                >
                  {isLoading ? "Atualizando..." : "Atualizar Agora"}
                </Button>
                {isLoading && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                )}
              </div>
            </div>


          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <TimeSeriesChart
            title="Temperatura"
            description="Temperatura em tempo real"
            data={temperatureData}
            dataKey="value"
            unit="°C"
            color="hsl(var(--chart-4))"
          />

          <TimeSeriesChart
            title="Umidade"
            description="Umidade do ambiente em tempo real"
            data={humidityData}
            dataKey="value"
            unit="%"
            color="hsl(var(--chart-2))"
          />

          <TimeSeriesChart
            title="Luminosidade"
            description="Luminosidade geral em tempo real"
            data={lightLevelData}
            dataKey="value"
            unit=" lux"
            color="hsl(var(--chart-3))"
          />

          <TimeSeriesChart
            title="Umidade do Solo"
            description="Umidade do solo em tempo real"
            data={soilMoistureData}
            dataKey="value"
            unit="%"
            color="hsl(var(--chart-1))"
          />
        </div>
      </div>
    </div>
  )
}

// Countdown
function CountdownTimer() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev > 0 ? prev - 1 : 60);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <span>{seconds}s</span>;
}
