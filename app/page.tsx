"use client"

import { useEffect, useState } from "react"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Activity, Lightbulb, Fan, Thermometer, Droplets } from "lucide-react"

import { SensorData } from "@/format/data_format"
import { apiService } from "@/services/service"

// Mock data generators
const transformDataForChart = (data: SensorData[], field: keyof SensorData) => {
  return data.map(item => ({
    time: new Date(item.created_at).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Number(item[field]) || 0,
  })).slice(-20);
}

export default function IoTDashboard() {

  // Control states
  const [lightOn, setLightOn] = useState(false)
  const [fanOn, setFanOn] = useState(false)
  const [tempThreshold, setTempThreshold] = useState("25")
  const [humidityThreshold, setHumidityThreshold] = useState("60")

  const [sensorData, setSensorData] = useState<SensorData[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  useEffect(() => {

    // Busca dados imediatamente
    fetchData();

    const interval = setInterval(() => {
      fetchData();
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
            <CardDescription className="text-muted-foreground">
              Dados atualizados automaticamente a cada 1 minuto
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
            <CardDescription className="text-muted-foreground">
              Painel Dispositivos IoT e Limites
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Light Control */}
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={`h-5 w-5 ${lightOn ? "text-chart-3" : "text-muted-foreground"}`} />
                    <Label htmlFor="light-switch" className="text-sm font-medium text-foreground">
                      Luz
                    </Label>
                  </div>
                  <Switch id="light-switch" checked={lightOn} onCheckedChange={setLightOn} />
                </div>
                <p className="text-xs text-muted-foreground">Status: {lightOn ? "ON" : "OFF"}</p>
              </div>

              {/* Fan Control */}
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fan className={`h-5 w-5 ${fanOn ? "text-chart-2" : "text-muted-foreground"}`} />
                    <Label htmlFor="fan-switch" className="text-sm font-medium text-foreground">
                      Fan
                    </Label>
                  </div>
                  <Switch id="fan-switch" checked={fanOn} onCheckedChange={setFanOn} />
                </div>
                <p className="text-xs text-muted-foreground">Status: {fanOn ? "ON" : "OFF"}</p>
              </div>

              {/* Temperature Threshold */}
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-chart-4" />
                  <Label htmlFor="temp-threshold" className="text-sm font-medium text-foreground">
                    Temperatura Limite
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="temp-threshold"
                    type="number"
                    value={tempThreshold}
                    onChange={(e) => setTempThreshold(e.target.value)}
                    className="h-8 bg-background text-foreground"
                  />
                  <span className="text-xs text-muted-foreground">°C</span>
                </div>
              </div>

              {/* Humidity Threshold */}
              <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-chart-2" />
                  <Label htmlFor="humidity-threshold" className="text-sm font-medium text-foreground">
                    Umidade Limite
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id="humidity-threshold"
                    type="number"
                    value={humidityThreshold}
                    onChange={(e) => setHumidityThreshold(e.target.value)}
                    className="h-8 bg-background text-foreground"
                  />
                  <span className="text-xs text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Aplicar Alterações</Button>
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
