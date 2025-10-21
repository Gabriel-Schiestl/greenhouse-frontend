"use client"

import { useState } from "react"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Activity, Lightbulb, Fan, Thermometer, Droplets } from "lucide-react"

// Mock data generators
const generateTimeSeriesData = (baseValue: number, variance: number, points = 20) => {
  const now = Date.now()
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 60000).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: Number((baseValue + (Math.random() - 0.5) * variance).toFixed(2)),
  }))
}

export default function IoTDashboard() {
  // Control states
  const [lightOn, setLightOn] = useState(false)
  const [fanOn, setFanOn] = useState(false)
  const [tempThreshold, setTempThreshold] = useState("25")
  const [humidityThreshold, setHumidityThreshold] = useState("60")

  // Mock sensor data
  const temperatureData = generateTimeSeriesData(23, 4)
  const humidityData = generateTimeSeriesData(55, 15)
  const lightLevelData = generateTimeSeriesData(450, 200)
  const powerConsumptionData = generateTimeSeriesData(120, 40)

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border pb-6">
          <Activity className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">IoT Management Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and device control</p>
          </div>
        </div>

        {/* Control Panel */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Device Controls</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your IoT devices and set automation thresholds
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
                      Light
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
                    Temp Threshold
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
                    Humidity Threshold
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
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Apply Settings</Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted bg-transparent">
                Reset to Default
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          <TimeSeriesChart
            title="Temperature"
            description="Real-time temperature monitoring"
            data={temperatureData}
            dataKey="value"
            unit="°C"
            color="hsl(var(--chart-4))"
          />

          <TimeSeriesChart
            title="Humidity"
            description="Ambient humidity levels"
            data={humidityData}
            dataKey="value"
            unit="%"
            color="hsl(var(--chart-2))"
          />

          <TimeSeriesChart
            title="Light Level"
            description="Ambient light intensity"
            data={lightLevelData}
            dataKey="value"
            unit=" lux"
            color="hsl(var(--chart-3))"
          />

          <TimeSeriesChart
            title="Power Consumption"
            description="Real-time power usage"
            data={powerConsumptionData}
            dataKey="value"
            unit="W"
            color="hsl(var(--chart-1))"
          />
        </div>
      </div>
    </div>
  )
}
