import express = require('express');
import userRoutes from './routes/userRoutes';
import activityRoutes from './routes/activityRoutes';
import cors = require('cors');
import morgan = require('morgan');
import { AppDataSource } from "./data-source"
import { Role } from './entity/Role';
import { User } from './entity/User';

AppDataSource.initialize().then(async () => {
  const userRepository = AppDataSource.getRepository(User);
  const roleRepository = AppDataSource.getRepository(Role);

  const roles = await roleRepository.find();

  if (roles.length === 0) {
    const admin = new Role();
    admin.name = "admin";
    await roleRepository.save(admin);

    const user = new Role();
    user.name = "user";
    await roleRepository.save(user);
  }

  console.log("Database connected")
}).catch(error => console.log(error))

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan('dev'));

// Routes
app.use('/users', userRoutes);
app.use('/activities', activityRoutes);

module.exports = app;