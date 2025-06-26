import { toast } from 'react-toastify';

const cropService = {
  async getAll() {
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
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "variety"
            }
          },
          {
            "field": {
              "Name": "field_location"
            }
          },
          {
            "field": {
              "Name": "planting_date"
            }
          },
          {
            "field": {
              "Name": "expected_harvest_date"
            }
          },
          {
            "field": {
              "Name": "status"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops:", error);
      toast.error("Failed to fetch crops");
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {
            "field": {
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "variety"
            }
          },
          {
            "field": {
              "Name": "field_location"
            }
          },
          {
            "field": {
              "Name": "planting_date"
            }
          },
          {
            "field": {
              "Name": "expected_harvest_date"
            }
          },
          {
            "field": {
              "Name": "status"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('crop', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching crop with ID ${id}:`, error);
      throw new Error('Crop not found');
    }
  },

  async getByFarmId(farmId) {
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
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "variety"
            }
          },
          {
            "field": {
              "Name": "field_location"
            }
          },
          {
            "field": {
              "Name": "planting_date"
            }
          },
          {
            "field": {
              "Name": "expected_harvest_date"
            }
          },
          {
            "field": {
              "Name": "status"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          }
        ],
        "where": [
          {
            "FieldName": "farm_id",
            "Operator": "EqualTo",
            "Values": [parseInt(farmId, 10)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching crops by farm:", error);
      toast.error("Failed to fetch crops");
      return [];
    }
  },

  async create(cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            Name: cropData.name,
            variety: cropData.variety,
            field_location: cropData.fieldLocation,
            planting_date: cropData.plantingDate,
            expected_harvest_date: cropData.expectedHarvestDate,
            status: cropData.status,
            farm_id: parseInt(cropData.farmId, 10)
          }
        ]
      };
      
      const response = await apperClient.createRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }
      
      throw new Error('Failed to create crop');
    } catch (error) {
      console.error("Error creating crop:", error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            Id: parseInt(id, 10),
            Name: cropData.name,
            variety: cropData.variety,
            field_location: cropData.fieldLocation,
            planting_date: cropData.plantingDate,
            expected_harvest_date: cropData.expectedHarvestDate,
            status: cropData.status,
            farm_id: parseInt(cropData.farmId, 10)
          }
        ]
      };
      
      const response = await apperClient.updateRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }
      
      throw new Error('Failed to update crop');
    } catch (error) {
      console.error("Error updating crop:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      };
      
      const response = await apperClient.deleteRecord('crop', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successfulDeletions.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting crop:", error);
      throw error;
    }
  }
};

export default cropService;