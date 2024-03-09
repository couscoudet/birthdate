import AuthController from "./controller/AuthConctroller";
import { BirthDayController } from "./controller/BirthDayController";
import UserController from "./controller/UserController";

export const Routes = [
  //store birthdays
  {
    method: "post",
    url: "/api/birthday",
    action: "store",
    controller: BirthDayController,
  },

  //get birthdays by month
  {
    method: "get",
    url: "/api/birthday/by-month/:month",
    action: "getByMonth",
    controller: BirthDayController,
  },

  //get birthdays by name query
  {
    method: "get",
    url: "/api/birthday/by-name/:query",
    action: "searchByNameQuery",
    controller: BirthDayController,
  },

  //delete birthday
  {
    method: "delete",
    url: "/api/birthday/:id",
    action: "delete",
    controller: BirthDayController,
  },

  //create user
  {
    method: "post",
    url: "/signup",
    action: "store",
    controller: UserController,
  },

  //login
  {
    method: "post",
    url: "/login",
    action: "login",
    controller: AuthController,
  },
];
