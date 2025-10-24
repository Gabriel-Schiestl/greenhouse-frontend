export interface SensorData {
    id:             string;
    sensor_id:      string;
    temperature:    number;
    humidity:       number;
    soil_moisture:  number;
    light_level:    number;
    created_at:     string;
    updated_at:     string;
}

export interface ApiResponse<T> {
    status:    number;
    data?:      T;
    message?:   string;
}