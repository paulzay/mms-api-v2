import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Role } from "./entity/Role"
import { ActivityLog } from "./entity/ActivityLog"
import { Member } from "./entity/Member"
import { Group } from "./entity/Group"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [User, Role, ActivityLog, Role, Member, Group],
    migrations: [],
    subscribers: [],
})
