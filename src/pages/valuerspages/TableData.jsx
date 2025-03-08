import User from "../../images/avatar/b-sm.jpg";
import User2 from "../../images/avatar/c-sm.jpg";
import User3 from "../../images/avatar/a-sm.jpg";
import User4 from "../../images/avatar/d-sm.jpg";
import React from "react";
import { UserAvatar, Icon } from "../../components/Component";
import { findUpper } from "../../utils/Utils";

export const dataTableColumns = [
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Age",
    selector: (row) => row.age,
    sortable: true,
    hide: 370,
  },
  {
    name: "Gender",
    selector: (row) => row.gender,
    sortable: true,
    hide: "sm",
  },
  {
    name: "Company",
    selector: (row) => row.company,
    sortable: true,
    hide: "sm",
  },
  {
    name: "Start Date",
    selector: (row) => row.startDate,
    sortable: true,
    hide: "md",
  },
  {
    name: "Salary",
    selector: (row) => row.salary,
    sortable: false,
    hide: "md",
  },
];


export const DataTableData = [
  {
    id: 0,
    name: "Francine Kirby",
    age: 24,
    gender: "female",
    company: "BUZZWORKS",
    startDate: "2017-02-17",
    salary: "$2,570.39",
  },
  {
    id: 1,
    name: "Reva Best",
    age: 40,
    gender: "female",
    company: "MARQET",
    startDate: "2021-10-14",
    salary: "$1,488.76",
  },
  {
    id: 2,
    name: "Alexis Flores",
    age: 21,
    gender: "female",
    company: "OBONES",
    startDate: "2020-04-28",
    salary: "$1,336.93",
  },
  {
    id: 3,
    name: "Nixon Sullivan",
    age: 30,
    gender: "male",
    company: "SLUMBERIA",
    startDate: "2016-10-08",
    salary: "$2,156.70",
  },
  {
    id: 4,
    name: "Foreman Wooten",
    age: 20,
    gender: "male",
    company: "ESCENTA",
    startDate: "2018-07-12",
    salary: "$3,057.42",
  },
  {
    id: 5,
    name: "Franco Davis",
    age: 28,
    gender: "male",
    company: "ZILLACON",
    startDate: "2015-10-08",
    salary: "$2,730.88",
  },
  {
    id: 6,
    name: "Bullock Kline",
    age: 32,
    gender: "male",
    company: "SAVVY",
    startDate: "2017-07-03",
    salary: "$2,986.05",
  },
  {
    id: 7,
    name: "Baird Coffey",
    age: 36,
    gender: "male",
    company: "BLEENDOT",
    startDate: "2014-01-27",
    salary: "$2,755.80",
  },
  {
    id: 8,
    name: "Eula Walters",
    age: 40,
    gender: "female",
    company: "UXMOX",
    startDate: "2020-09-19",
    salary: "$3,302.75",
  },
  {
    id: 9,
    name: "Gaines Moss",
    age: 26,
    gender: "male",
    company: "INCUBUS",
    startDate: "2017-10-13",
    salary: "$3,856.24",
  },
  {
    id: 10,
    name: "Sargent Winters",
    age: 28,
    gender: "male",
    company: "AUSTEX",
    startDate: "2020-12-26",
    salary: "$3,668.64",
  },
  {
    id: 11,
    name: "Sybil Patton",
    age: 35,
    gender: "female",
    company: "ZILIDIUM",
    startDate: "2020-06-19",
    salary: "$1,987.14",
  },
  {
    id: 12,
    name: "Henderson Elliott",
    age: 39,
    gender: "male",
    company: "ZOARERE",
    startDate: "2016-08-16",
    salary: "$1,795.31",
  },
  {
    id: 13,
    name: "Combs Irwin",
    age: 33,
    gender: "male",
    company: "COLAIRE",
    startDate: "2017-07-19",
    salary: "$2,396.73",
  },
  {
    id: 14,
    name: "Fleming Buchanan",
    age: 33,
    gender: "male",
    company: "WEBIOTIC",
    startDate: "2021-09-12",
    salary: "$3,406.96",
  },
  {
    id: 15,
    name: "Mcbride Dixon",
    age: 25,
    gender: "male",
    company: "ZBOO",
    startDate: "2017-12-08",
    salary: "$1,065.32",
  },
  {
    id: 16,
    name: "Nettie Greer",
    age: 32,
    gender: "female",
    company: "QUONK",
    startDate: "2014-03-15",
    salary: "$1,558.83",
  },
  {
    id: 17,
    name: "Anita Saunders",
    age: 39,
    gender: "female",
    company: "IDEALIS",
    startDate: "2015-07-31",
    salary: "$1,848.84",
  },
  {
    id: 18,
    name: "Darcy Mcclain",
    age: 24,
    gender: "female",
    company: "DIGIGEN",
    startDate: "2020-02-19",
    salary: "$3,382.78",
  },
  {
    id: 19,
    name: "Jodi Knowles",
    age: 32,
    gender: "female",
    company: "KONGENE",
    startDate: "2014-03-09",
    salary: "$1,668.05",
  },
  {
    id: 20,
    name: "Cathleen Schroeder",
    age: 21,
    gender: "female",
    company: "TROPOLIS",
    startDate: "2014-09-28",
    salary: "$2,730.21",
  },
  {
    id: 21,
    name: "Lea Fitzgerald",
    age: 24,
    gender: "female",
    company: "AVENETRO",
    startDate: "2015-08-17",
    salary: "$2,547.85",
  },
  {
    id: 22,
    name: "Pitts Graham",
    age: 20,
    gender: "male",
    company: "MALATHION",
    startDate: "2020-05-08",
    salary: "$3,538.05",
  },
  {
    id: 23,
    name: "Lane Glass",
    age: 22,
    gender: "male",
    company: "NETROPIC",
    startDate: "2020-01-26",
    salary: "$1,141.42",
  },
  {
    id: 24,
    name: "Tisha Cleveland",
    age: 33,
    gender: "female",
    company: "YURTURE",
    startDate: "2020-01-11",
    salary: "$2,877.89",
  },
  {
    id: 25,
    name: "Ortiz Nguyen",
    age: 34,
    gender: "male",
    company: "TRIBALOG",
    startDate: "2019-07-09",
    salary: "$3,156.79",
  },
  {
    id: 26,
    name: "Katrina Alvarado",
    age: 33,
    gender: "female",
    company: "PYRAMIA",
    startDate: "2016-07-04",
    salary: "$2,273.02",
  },
  {
    id: 27,
    name: "Craig Chang",
    age: 30,
    gender: "male",
    company: "COMVEYER",
    startDate: "2019-09-08",
    salary: "$3,028.17",
  },
  {
    id: 28,
    name: "Joann Short",
    age: 30,
    gender: "female",
    company: "PRISMATIC",
    startDate: "2017-08-17",
    salary: "$2,041.14",
  },
  {
    id: 29,
    name: "Vargas Rivers",
    age: 23,
    gender: "male",
    company: "ELPRO",
    startDate: "2014-04-25",
    salary: "$1,906.04",
  },
  {
    id: 30,
    name: "Snow Hampton",
    age: 37,
    gender: "male",
    company: "SNORUS",
    startDate: "2014-11-30",
    salary: "$1,419.30",
  },
  {
    id: 31,
    name: "Ellison Pennington",
    age: 32,
    gender: "male",
    company: "APEX",
    startDate: "2020-02-06",
    salary: "$3,486.62",
  },
  {
    id: 32,
    name: "Kate Donaldson",
    age: 28,
    gender: "female",
    company: "TALENDULA",
    startDate: "2021-07-05",
    salary: "$3,025.63",
  },
  {
    id: 33,
    name: "Bridges Franco",
    age: 20,
    gender: "male",
    company: "FURNAFIX",
    startDate: "2021-09-21",
    salary: "$1,371.72",
  },
  {
    id: 34,
    name: "Montgomery Moreno",
    age: 24,
    gender: "male",
    company: "ZIORE",
    startDate: "2018-08-04",
    salary: "$1,016.90",
  },
  {
    id: 35,
    name: "Meyers Barnett",
    age: 25,
    gender: "male",
    company: "OCEANICA",
    startDate: "2017-03-04",
    salary: "$3,804.05",
  },
  {
    id: 36,
    name: "Gertrude Glenn",
    age: 29,
    gender: "female",
    company: "FORTEAN",
    startDate: "2018-04-19",
    salary: "$3,883.97",
  },
  {
    id: 37,
    name: "Wise Fitzpatrick",
    age: 34,
    gender: "male",
    company: "RODEOLOGY",
    startDate: "2017-11-08",
    salary: "$1,400.23",
  },
  {
    id: 38,
    name: "Joseph Leonard",
    age: 30,
    gender: "male",
    company: "QIMONK",
    startDate: "2014-12-01",
    salary: "$2,689.09",
  },
  {
    id: 39,
    name: "Booker Chambers",
    age: 24,
    gender: "male",
    company: "SKYPLEX",
    startDate: "2014-07-29",
    salary: "$3,949.05",
  },
  {
    id: 40,
    name: "Corrine Kerr",
    age: 35,
    gender: "female",
    company: "FIBEROX",
    startDate: "2019-06-07",
    salary: "$2,245.15",
  },
  {
    id: 41,
    name: "Williamson Daniel",
    age: 26,
    gender: "male",
    company: "GREEKER",
    startDate: "2020-09-15",
    salary: "$3,814.20",
  },
  {
    id: 42,
    name: "Anthony Oneill",
    age: 36,
    gender: "male",
    company: "MIXERS",
    startDate: "2020-07-22",
    salary: "$1,129.99",
  },
  {
    id: 43,
    name: "Marquita Hubbard",
    age: 25,
    gender: "female",
    company: "VELOS",
    startDate: "2015-11-19",
    salary: "$2,227.39",
  },
  {
    id: 44,
    name: "Dena Clements",
    age: 34,
    gender: "female",
    company: "ORBEAN",
    startDate: "2020-08-31",
    salary: "$2,689.21",
  },
  {
    id: 45,
    name: "Tia Curry",
    age: 37,
    gender: "female",
    company: "MUSAPHICS",
    startDate: "2019-04-02",
    salary: "$3,784.72",
  },
  {
    id: 46,
    name: "Rios House",
    age: 30,
    gender: "male",
    company: "IMPERIUM",
    startDate: "2015-08-23",
    salary: "$1,519.37",
  },
  {
    id: 47,
    name: "Whitfield Mcleod",
    age: 37,
    gender: "male",
    company: "SCHOOLIO",
    startDate: "2015-03-17",
    salary: "$2,365.21",
  },
  {
    id: 48,
    name: "Conrad Holt",
    age: 38,
    gender: "male",
    company: "MENBRAIN",
    startDate: "2020-02-01",
    salary: "$2,289.04",
  },
  {
    id: 49,
    name: "Mclaughlin Fletcher",
    age: 34,
    gender: "male",
    company: "SOLAREN",
    startDate: "2018-09-05",
    salary: "$1,115.62",
  },
];

