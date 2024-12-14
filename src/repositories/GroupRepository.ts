import { Entity } from "typeorm";
import { Group } from "../entity/Group";
import { AppDataSource } from "../data-source";

@Entity()
class GroupRepository {
  private repository = AppDataSource.getRepository(Group);

  async create(groupData: Partial<Group>): Promise<Group> {
    const group = this.repository.create(groupData);
    return this.repository.save(group);
  }

  async findAll(): Promise<Group[]> {
    return this.repository.find();
  }

  async findById(id: number): Promise<Group | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: number, groupData: Partial<Group>): Promise<Group | null> {
    await this.repository.update(id, groupData);
    return this.findById(id);
  }

  async delete(id: number): Promise<number> {
    const res = await this.repository.delete(id);
    return res.affected || 0;
  }

  async addMember(groupId: number, userId: number): Promise<Group | null> {
    const group = await this.findById(groupId);
    if (!group) {
      throw new Error("Group not found");
    }

    group.members.push({ id: userId } as any);
    await this.repository.save(group);
    return group;
  }

  async removeMember(groupId: number, userId: number): Promise<Group | null> {
    const group = await this.findById(groupId as number);
    if (!group) {
      throw new Error("Group not found");
    }
    return this.update(groupId, { members: group.members.filter(member => member.id !== userId) }); 
  }
}

export const groupRepository = new GroupRepository();