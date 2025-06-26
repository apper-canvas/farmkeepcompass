import { toast } from 'react-toastify';

const expenseService = {
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
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "amount"
            }
          },
          {
            "field": {
              "Name": "category"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "date"
            }
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to fetch expenses");
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
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "amount"
            }
          },
          {
            "field": {
              "Name": "category"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "date"
            }
          }
        ]
      };
      
      const response = await apperClient.getRecordById('expense', parseInt(id, 10), params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching expense with ID ${id}:`, error);
      throw new Error('Expense not found');
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
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "amount"
            }
          },
          {
            "field": {
              "Name": "category"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "date"
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
      
      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses by farm:", error);
      toast.error("Failed to fetch expenses");
      return [];
    }
  },

  async getSummaryByCategory(farmId = null) {
    try {
      const expenses = farmId ? await this.getByFarmId(farmId) : await this.getAll();
      
      const summary = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});
      
      return summary;
    } catch (error) {
      console.error("Error getting expense summary:", error);
      toast.error("Failed to get expense summary");
      return {};
    }
  },

  async create(expenseData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        records: [
          {
            Name: expenseData.name || expenseData.description,
            farm_id: parseInt(expenseData.farmId, 10),
            amount: parseFloat(expenseData.amount),
            category: expenseData.category,
            description: expenseData.description,
            date: expenseData.date
          }
        ]
      };
      
      const response = await apperClient.createRecord('expense', params);
      
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
      
      throw new Error('Failed to create expense');
    } catch (error) {
      console.error("Error creating expense:", error);
      throw error;
    }
  },

  async update(id, expenseData) {
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
            Name: expenseData.name || expenseData.description,
            farm_id: parseInt(expenseData.farmId, 10),
            amount: parseFloat(expenseData.amount),
            category: expenseData.category,
            description: expenseData.description,
            date: expenseData.date
          }
        ]
      };
      
      const response = await apperClient.updateRecord('expense', params);
      
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
      
      throw new Error('Failed to update expense');
    } catch (error) {
      console.error("Error updating expense:", error);
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
      
      const response = await apperClient.deleteRecord('expense', params);
      
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
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // Analytics functions for charts
  async getExpensesByTimeRange(startDate, endDate, farmId = null) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const whereConditions = [
        {
          "FieldName": "date",
          "Operator": "GreaterThanOrEqualTo",
          "Values": [startDate]
        },
        {
          "FieldName": "date",
          "Operator": "LessThanOrEqualTo",
          "Values": [endDate]
        }
      ];

      if (farmId) {
        whereConditions.push({
          "FieldName": "farm_id",
          "Operator": "EqualTo",
          "Values": [parseInt(farmId, 10)]
        });
      }
      
      const params = {
        "fields": [
          {
            "field": {
              "Name": "Name"
            }
          },
          {
            "field": {
              "Name": "farm_id"
            }
          },
          {
            "field": {
              "Name": "amount"
            }
          },
          {
            "field": {
              "Name": "category"
            }
          },
          {
            "field": {
              "Name": "description"
            }
          },
          {
            "field": {
              "Name": "date"
            }
          }
        ],
        "where": whereConditions
      };
      
      const response = await apperClient.fetchRecords('expense', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching expenses by time range:", error);
      toast.error("Failed to fetch expenses");
      return [];
    }
  },

  async getTrendData(period = 'monthly', farmId = null) {
    try {
      const expenses = farmId ? await this.getByFarmId(farmId) : await this.getAll();
      
      const groupedData = {};
      
      expenses.forEach(expense => {
        const date = new Date(expense.date);
        let key;
        
        if (period === 'monthly') {
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
          key = date.getFullYear().toString();
        }
        
        if (!groupedData[key]) {
          groupedData[key] = { total: 0, categories: {} };
        }
        
        groupedData[key].total += expense.amount;
        groupedData[key].categories[expense.category] = 
          (groupedData[key].categories[expense.category] || 0) + expense.amount;
      });

      return Object.entries(groupedData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([period, data]) => ({
          period,
          total: data.total,
          categories: data.categories
        }));
    } catch (error) {
      console.error("Error getting trend data:", error);
      toast.error("Failed to get trend data");
      return [];
    }
  },

  async getFarmComparison() {
    try {
      const expenses = await this.getAll();
      const farmTotals = {};
      
      expenses.forEach(expense => {
        const farmId = expense.farm_id;
        if (!farmTotals[farmId]) {
          farmTotals[farmId] = { total: 0, categories: {} };
        }
        
        farmTotals[farmId].total += expense.amount;
        farmTotals[farmId].categories[expense.category] = 
          (farmTotals[farmId].categories[expense.category] || 0) + expense.amount;
      });

      return farmTotals;
    } catch (error) {
      console.error("Error getting farm comparison:", error);
      toast.error("Failed to get farm comparison");
      return {};
    }
  },

  async getCropExpenses(cropId = null) {
    try {
      const expenses = await this.getAll();
      
      const cropData = {};
      expenses.forEach(expense => {
        if (!cropData[expense.category]) {
          cropData[expense.category] = 0;
        }
        cropData[expense.category] += expense.amount;
      });
      
      return cropData;
    } catch (error) {
      console.error("Error getting crop expenses:", error);
      toast.error("Failed to get crop expenses");
      return {};
    }
  }
};

export default expenseService;