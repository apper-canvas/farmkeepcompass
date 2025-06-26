import { toast } from 'react-toastify';

const weatherService = {
  async getForecast() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        "fields": [
          {
            "field": {
              "Name": "date"
            }
          },
          {
            "field": {
              "Name": "high"
            }
          },
          {
            "field": {
              "Name": "low"
            }
          },
          {
            "field": {
              "Name": "condition"
            }
          },
          {
            "field": {
              "Name": "precipitation"
            }
          },
          {
            "field": {
              "Name": "humidity"
            }
          },
          {
            "field": {
              "Name": "wind_speed"
            }
          }
        ],
        "orderBy": [
          {
            "fieldName": "date",
            "sorttype": "ASC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      toast.error("Failed to fetch weather forecast");
      return [];
    }
  },

  async getTodaysWeather() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const today = new Date().toISOString().split('T')[0];
      
      const params = {
        "fields": [
          {
            "field": {
              "Name": "date"
            }
          },
          {
            "field": {
              "Name": "high"
            }
          },
          {
            "field": {
              "Name": "low"
            }
          },
          {
            "field": {
              "Name": "condition"
            }
          },
          {
            "field": {
              "Name": "precipitation"
            }
          },
          {
            "field": {
              "Name": "humidity"
            }
          },
          {
            "field": {
              "Name": "wind_speed"
            }
          }
        ],
        "where": [
          {
            "FieldName": "date",
            "Operator": "EqualTo",
            "Values": [today]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('weather', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        // Fall back to getting first weather record
        const allWeather = await this.getForecast();
        return allWeather.length > 0 ? allWeather[0] : null;
      }
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      
      // Fall back to getting first weather record if no today's weather found
      const allWeather = await this.getForecast();
      return allWeather.length > 0 ? allWeather[0] : null;
    } catch (error) {
      console.error("Error fetching today's weather:", error);
      toast.error("Failed to fetch today's weather");
      return null;
    }
  }
};

export default weatherService;