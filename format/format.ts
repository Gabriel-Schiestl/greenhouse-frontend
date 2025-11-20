export interface GlpData {
    id:             string;
    sensor_id:      string;
    temperature:    number;
    humidity:       number;
    soil_moisture:  number;
    light_level:    number;
    created_at:     string;
    updated_at:     string;
}

export interface GlpParameters {
    id:                  number;
    sensor_id:           string;
    max_temperature:     number;
    max_humidity:        number;
    min_soil_moisture:   number;
    min_light_level:     number;
    turn_on_ventilation: boolean;
    turn_on_irrigation:  boolean;
    turn_on_lighting:    boolean;
    last_user_update:    string;
}

export interface ApiResponse<T> {
    status:    number;
    data?:      T;
    message?:   string;
}