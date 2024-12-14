import { AppDataSource } from "../data-source";
import { ActivityLog } from "../entity/ActivityLog";

class ActivityLogRepository {
  private repository = AppDataSource.getRepository(ActivityLog);

  async getAllActivityLogs() {
    return this.repository.find();
  }
  
  async getActivityLogById(id: number) {
    // Logic to fetch an activity log by id
  }
  
  async createActivityLog(data: any) {
    if (!data) {
      throw new Error("All fiends is required");
    }

    return this.repository.save(data);
  }
  
  async updateActivityLog(id: number, data: any) {
    if (!data) {
      throw new Error("All fiends is required");
    }

    return this.repository.update(id, data);
  }
  
  async deleteActivityLog(id: number) {
    const res = await this.repository.delete(id);
    return res.affected;
  }
}

export const activityLogRepository = new ActivityLogRepository();