import User from "../../../images/avatar/b-sm.jpg";
import User2 from "../../../images/avatar/c-sm.jpg";
// import User3 from "../../../images/avatar/a-sm.jpg";
import User4 from "../../../images/avatar/d-sm.jpg";
import PlanS1 from "../../../images/icons/plan-s1.svg";
import PlanS2 from "../../../images/icons/plan-s2.svg";
import PlanS3 from "../../../images/icons/plan-s3.svg";

const data = {
  navigation : [
    {
      id: 0,
      text: "Home",
      icon: "home-alt",
      link: "/",
    },
    {
      id: 1,
      text: "Files",
      icon: "file-docs",
      link: "/files",
      sub: ["New Files", "This Month", "Older Files"],
    },
    {
      id: 2,
      text: "Starred",
      icon: "star",
      link: "/starred",
    },
    {
      id: 3,
      text: "Shared",
      icon: "share-alt",
      link: "/shared",
    },
    {
      id: 4,
      text: "Recovery",
      icon: "trash",
      link: "/recovery",
    },
    {
      id: 5,
      text: "Settings",
      icon: "setting",
      link: "/settings",
    },
  ],
  users: [
    { id:'uid001', name: "Illiash Hossain", theme: "purple" },
    { id:'uid002', name: "Abu Bin", theme: "blue" },
    { id:'uid003', name: "Hao Limae", theme: "purple", displayPicture: User },
    { id:'uid004', name: "Kimberly May", theme: "purple", displayPicture: User2 },
    { id:'uid005', name: "Courier Kay", theme: "purple", displayPicture: User4 },
  ],
  plans:[
    {
      id: 'planid01',
      title: "Starter",
      logo: PlanS1,
      desc: "If you are a small business amn please select this plan",
      amount: 99,
      memory: 25,
      userNumber: 1,
      tags: false,
    },
    {
      id: 'planid02',
      title: "Pro",
      logo: PlanS2,
      desc: "If you are a small business amn please select this plan",
      amount: 299,
      userNumber: 5,
      memory: 50,
      tags: true,
    },
    {
      id: 'planid03',
      title: "Enterprise",
      logo: PlanS3,
      desc: "If you are a small business amn please select this plan",
      amount: 599,
      userNumber: 20,
      memory: 75,
      tags: false,
    },
    {
      id: 'planid04',
      title: "Premium",
      logo: PlanS1,
      desc: "If you are a small business amn please select this plan",
      amount: 999,
      memory: 100,
      userNumber: "Unlimited",
      tags: false,
    },
  ],
  folderTypes : [
    {
      id: 1,
      value: "general",
      label: "General",
    },
    {
      id: 2,
      value: "shared",
      label: "Shared",
    },
    {
      id: 3,
      value: "secure",
      label: "Secure",
    },
  ],
  dateFormat:[
    {
      id: 0,
      label: "MM/DD/YYYY",
      value: "MM/DD/YYYY",
    },
    {
      id: 1,
      label: "DD/MM/YYYY",
      value: "DD/MM/YYYY",
    },
    {
      id: 2,
      label: "YYYY/MM/DD",
      value: "YYYY/MM/DD",
    },
  ],
  languageOptions : [
    {
      id: 0,
      label: "English (United States)",
      value: "English (United States)",
    },
    {
      id: 1,
      label: "English (United Kingdom)",
      value: "English (United Kingdom)",
    },
    {
      id: 2,
      label: "French",
      value: "French",
    },
    {
      id: 3,
      label: "Spanish",
      value: "Spanish",
    },
    {
      id: 4,
      label: "Chinese",
      value: "Chinese",
    },
    {
      id: 5,
      label: "Bangla",
      value: "Bangla",
    },
  ],
  timezoneFormat : [
    {
      id: 0,
      label: "Bangladesh (GMT +6)",
      value: "Bangladesh (GMT +6)",
    },
    {
      id: 1,
      label: "United Kingdom (GMT +0)",
      value: "United Kingdom (GMT +0)",
    },
    {
      id: 2,
      label: "Spain (GMT +1)",
      value: "Spain (GMT +1)",
    },
    {
      id: 6,
      label: "China (GMT +8)",
      value: "China (GMT +8)",
    },
    {
      id: 4,
      label: "Australia (GMT +9)",
      value: "Australia (GMT +9)",
    },
    {
      id: 3,
      label: "Brazil (GMT -3)",
      value: "Brazil (GMT -3)",
    },
    {
      id: 5,
      label: "United States (GMT -8)",
      value: "United States (GMT -8)",
    },
  ],
}
export default data;

export const files = [
  {
    id: 'folder001',
    name: 'UI Design',
    ext: 'zip',
    time: '02:07 PM',
    date: '03 Mar',
    icon: 'folder',
    size: 87,
    type: 'folder',
    starred: true,
    access:['uid001', 'uid003', 'uid005']
  },
  {
    id: 'folder002',
    name: 'Proposal',
    ext: 'zip',
    time: '02:07 PM',
    date: '03 Mar',
    icon: 'folder',
    size: 93,
    type: 'folder',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005']
  },
  {
    id: 'folder003',
    name: 'A Projects',
    ext: 'zip',
    time: '02:07 PM',
    date: '03 Mar',
    icon: 'folder',
    size: 93,
    type: 'folder',
    starred: false,
    deleted: '02:07 PM, 03 Mar'
  },
  {
    id: 'folder004',
    name: 'DashLite Resource',
    ext: 'zip',
    time: '02:07 PM',
    date: '03 Mar',
    icon: 'folderSecure',
    size: 93,
    type: 'folder',
    starred: true,
    access:['uid001', 'uid003', 'uid004', 'uid005']
  },
  {
    id: 'folder005',
    name: '2019 Projects',
    ext: 'zip',
    time: '02:07 PM',
    date: '03 Mar',
    icon: 'folder',
    size: 93,
    type: 'folder',
    starred: false,
  },
  {
    id: 'file001',
    name: 'Update Data.xlsx',
    ext: 'xlsx',
    icon: 'fileSheet',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: true,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
  },
  {
    id: 'file002',
    name: 'dashlite-1.2.zip',
    ext: 'zip',
    icon: 'fileZip',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
  },
  {
    id: 'file003',
    name: 'covstats...1.0.zip',
    ext: 'zip',
    icon: 'fileZip',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
    deleted: '02:07 PM, 03 Mar'
  },
  {
    id: 'file004',
    name: 'Price-Update.doc',
    ext: 'doc',
    icon: 'fileDoc',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
  },
  {
    id: 'file005',
    name: 'Quotation.doc',
    ext: 'doc',
    icon: 'fileDoc',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    folder:0,
    deleted: '02:07 PM, 03 Mar'
  },
  {
    id: 'file006',
    name: 'Work-to-do.txt',
    ext: 'txt',
    icon: 'fileText',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    folder:0,
  },
  {
    id: 'file007',
    name: 'DashLite_Crypto_v1.psd',
    ext: 'psd',
    icon: 'fileMedia',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
  },
  {
    id: 'file008',
    name: 'New Movie 2020.mp4',
    ext: 'mp4',
    icon: 'fileMovie',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    folder:0,
  },
  {
    id: 'file009',
    name: 'Project Access.xls',
    ext: 'xls',
    icon: 'fileSheet',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    folder:0,
  },
  {
    id: 'file010',
    name: '2019 Presentation.ppt',
    ext: 'ppt',
    icon: 'filePPT',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
  },
  {
    id: 'file011',
    name: 'app-file-manager.html',
    ext: 'html',
    icon: 'fileCode',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
    deleted: '02:07 PM, 03 Mar'
  },
  {
    id: 'file012',
    name: 'Industrial_Other_PSD.zip',
    ext: 'zip',
    icon: 'fileZip',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
    deleted: '02:07 PM, 03 Mar'
  },
  {
    id: 'file013',
    name: '2_Home_WIP.psd',
    ext: 'psd',
    icon: 'fileMedia',
    time: '02:07 PM',
    date: '03 Mar',
    size: 41.5,
    type: 'file',
    starred: false,
    access:['uid001', 'uid003', 'uid004', 'uid005'],
    folder:0,
    deleted: '02:07 PM, 03 Mar'
  },
]