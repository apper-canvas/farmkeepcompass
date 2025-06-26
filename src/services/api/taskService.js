import { toast } from 'react-toastify';

const taskService = {
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
              "Name": "title"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "due_date"
            }
          },
          {
            "field": {
              "Name": "priority"
            }
          },
          {
            "field": {
              "Name": "completed"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "crop_id"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to fetch tasks");
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
              "Name": "title"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "due_date"
            }
          },
          {
            "field": {
              "Name": "priority"
            }
          },
          {
            "field": {
              "Name": "completed"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "crop_id"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('task', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw new Error('Task not found');
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
              "Name": "title"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "due_date"
            }
          },
          {
            "field": {
              "Name": "priority"
            }
          },
          {
            "field": {
              "Name": "completed"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "crop_id"
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
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by farm:", error);
      toast.error("Failed to fetch tasks");
      return [];
    }
  },

  async getTodaysTasks() {
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
              "Name": "title"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "due_date"
            }
          },
          {
            "field": {
              "Name": "priority"
            }
          },
          {
            "field": {
              "Name": "completed"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "crop_id"
            }
          }
        ],
        "where": [
          {
            "FieldName": "due_date",
            "Operator": "ExactMatch",
            "SubOperator": "Day",
            "Values": [today]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching today's tasks:", error);
      toast.error("Failed to fetch today's tasks");
      return [];
    }
  },

  async create(taskData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.dueDate,
            priority: taskData.priority,
            completed: false,
            farm_id: parseInt(taskData.farmId, 10),
            crop_id: taskData.cropId ? parseInt(taskData.cropId, 10) : null
          }
        ]
      };
      
      const response = await apperClient.createRecord('task', params);
      
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
      
      throw new Error('Failed to create task');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
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
            title: taskData.title,
            description: taskData.description,
            due_date: taskData.dueDate,
            priority: taskData.priority,
            completed: taskData.completed,
            farm_id: parseInt(taskData.farmId, 10),
            crop_id: taskData.cropId ? parseInt(taskData.cropId, 10) : null
          }
        ]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
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
      
      throw new Error('Failed to update task');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      // First get the current task
      const currentTask = await this.getById(id);
      
      // Update with toggled completion status
      return await this.update(id, {
        ...currentTask,
        completed: !currentTask.completed
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);
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
      
      const response = await apperClient.deleteRecord('task', params);
      
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
      console.error("Error deleting task:", error);
      throw error;
    }
  }
};

export default taskService;