import { BirthDayController } from "./controller/BirthDayController";

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
];
