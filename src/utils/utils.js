import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const capitalize = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const skills = [
    { value: "React", label: "React" },
    { value: "Angular", label: "Angular" },
    { value: "Vue.js", label: "Vue.js" },
    { value: "Svelte", label: "Svelte" },
    { value: "Node.js", label: "Node.js" },
    { value: "Express.js", label: "Express.js" },
    { value: "Django", label: "Django" },
    { value: "Flask", label: "Flask" },
    { value: "Ruby on Rails", label: "Ruby on Rails" },
    { value: "React Native", label: "React Native" },
    { value: "Flutter", label: "Flutter" },
    { value: "Swift", label: "Swift" },
    { value: "Kotlin", label: "Kotlin" },
    { value: "AWS", label: "AWS" },
    { value: "Azure", label: "Azure" },
    { value: "Docker", label: "Docker" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "Terraform", label: "Terraform" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "MySQL", label: "MySQL" },
    { value: "PostgreSQL", label: "PostgreSQL" },
    { value: "Firebase", label: "Firebase" },
    { value: "Ethical Hacking", label: "Ethical Hacking" },
    { value: "Network Security", label: "Network Security" },
    { value: "Cryptography", label: "Cryptography" },
    { value: "TensorFlow", label: "TensorFlow" },
    { value: "PyTorch", label: "PyTorch" },
    { value: "OpenCV", label: "OpenCV" },
    { value: "NLP", label: "NLP" },
    { value: "Pandas", label: "Pandas" },
    { value: "NumPy", label: "NumPy" },
    { value: "Power BI", label: "Power BI" },
    { value: "Tableau", label: "Tableau" }
];

export const experienceRange = Array.from({ length: 10 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} Year${i > 0 ? "s" : ""}`
}));



// utils/exportToExcel.js



export const exportToExcel = (jsonData, fileName = "Report") => {
  // Convert JSON to worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate Excel buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Save file
  const blob = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${fileName}.xlsx`);
};