import axios from "axios";
import { URL } from "../App";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
];

const addRegisterPage = (workbook, register) => {

  const worksheet = workbook.addWorksheet("REGISTER");

  worksheet.mergeCells("A1:F1");
  const headerCell = worksheet.getCell("A1");
  headerCell.value = "MONEY REGISTER";
  headerCell.font = { size: 28, color: { argb: "FF70AD47" } ,  name: "Bahnschrift Condensed" };
  headerCell.alignment = { horizontal: "center", vertical: "middle" };

  let tmc =0, tu=0, total_hostel_fee = 0, A2023=0, A2024=0, A2025=0;

  register.forEach(item=>{
      tmc += item.money_credited;
      tu += item.usage;
      total_hostel_fee += item.hostel_fee;
      if(item.year === 2023 || (item.year === 2024 && item.month < 8)){
          A2023 += item.usage;
      }
      else if(item.year === 2024 || (item.year === 2025 && item.month < 8)){
          A2024 += item.usage;
      }
      else {
          A2025 += item.usage;
      }
  });
  worksheet.mergeCells("A2:C2");
  worksheet.addRow([]);
  worksheet.getCell("A2").value = "TOTAL MONEY CREDITED : ";
  worksheet.getRow(1).height = 35;
  worksheet.getRow(2).height = 28;
  worksheet.getCell("A2").font = { size: 20,  name: "Bahnschrift Condensed" };
  worksheet.getCell("A2").alignment = { horizontal: "right", vertical: "middle" };
  worksheet.getCell("D2").value = tmc;
  worksheet.getCell("D2").numFmt = '#,##0'
  worksheet.getCell("D2").font = { size: 20,  name: "Bahnschrift Condensed" };
  worksheet.getCell("D2").alignment = { horizontal: "left", vertical: "middle" };

  worksheet.mergeCells("A3:C3");
  worksheet.getCell("A3").value = "TOTAL USAGE : ";
  worksheet.getRow(1).height = 35;
  worksheet.getRow(2).height = 28;
  worksheet.getCell("A3").font = { size: 20,  name: "Bahnschrift Condensed" };
  worksheet.getCell("A3").alignment = { horizontal: "right", vertical: "middle" };
  worksheet.getCell("D3").value = tu;
  worksheet.getCell("D3").numFmt = '#,##0'
  worksheet.getCell("D3").font = { size: 20,  name: "Bahnschrift Condensed" };
  worksheet.getCell("D3").alignment = { horizontal: "left", vertical: "middle" };


  worksheet.addRow([]);
  const headers = ["YEAR", "MONTH", "MONEY CREDITED", "HOSTEL FEE", "USAGE", "BALANCE"];
  const headerRow = worksheet.addRow(headers);

  // // Style headers
  headerRow.font = { color: { argb: "FFFFFFFF" }, size : 20 };
  headerRow.eachCell(cell=>{
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF6600" } };
      cell.font = { size: 20,  name: "Bahnschrift Condensed" };
  })
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.height = 30;

  register.forEach((transaction) => {
    const row = worksheet.addRow([
      transaction.year,
      MONTHS[transaction.month -1],
      transaction.money_credited,
      transaction.hostel_fee,
      transaction.usage,
      transaction.balance,
    ]);
    row?.eachCell((cell, colIndex) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      if(colIndex > 1)
          cell.numFmt = '#,##0'
    });
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.font = { size: 20,  name: "Bahnschrift Condensed" };
    row.height = 25;
  });

  // // Set column widths
  worksheet.columns = [
    { width: 13 }, // A
    { width: 24 }, // B
    { width: 25 }, // C
    { width: 17 }, // D
    { width: 17 }, // E
    { width: 17 },  // F
    { width: 8 },  // G
    { width: 8 },  // H
    { width: 20 },  // I
    { width: 15 },  // J
    { width: 15 },  // K
  ];

  worksheet.mergeCells("I5:K5");
  const catCell = worksheet.getCell("I5");
  catCell.value = "CATEGORICAL DATA";
  catCell.font = { size: 20 , color: { argb: "ffffffff" },  name: "Bahnschrift Condensed" };
  catCell.alignment = { horizontal: "center", vertical: "middle" };
  catCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00000000" } };

  const catData = {
      "MY USAGE : " : tu - total_hostel_fee,
      "TOTAL HOSTEL FEE : " : 36000 + total_hostel_fee,
      "COLLEGE FEE : " : 50000 + 355059,
      "LAPTOP" : 50000,
      "NET AMOUNT PAID : " : tu + 491059,
  }
  let iterater  = 6;
  for(const key in catData){
      const vlaueCells = worksheet.getCell("I"+iterater);
      worksheet.mergeCells(`I${iterater}:J${iterater}`);
      vlaueCells.value = key;
      vlaueCells.font = { size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      vlaueCells.alignment = { horizontal: "right", vertical: "middle" };
      const kCell = worksheet.getCell("K"+iterater);
      kCell.value = catData[key];
      kCell.font = { size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      kCell.numFmt = '#,##0'
      iterater++;
  }
  iterater += 3;

  worksheet.mergeCells(`I${iterater}:K${iterater}`);
  const annuval = worksheet.getCell("I"+iterater++);
  annuval.value = "ANNUAL SPENT MONEY";
  annuval.font = { size: 20 , color: { argb: "ffffffff" }, name: "Bahnschrift Condensed" };
  annuval.alignment = { horizontal: "center", vertical: "middle" };
  annuval.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00000000" } };

  const asm = {
      "2023 AUG - 2024 JULY : " : A2023,
      "2024 AUG - 2025 JULY : " : A2024,
      "2025 AUG - 2026 JULY : " : A2025,
      "TOTAL : " : A2023 + A2024 + A2025,
  }

  for(const key in asm){
      const vlaueCells = worksheet.getCell("I"+iterater);
      worksheet.mergeCells(`I${iterater}:J${iterater}`);
      vlaueCells.value = key;
      vlaueCells.font = { size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      vlaueCells.alignment = { horizontal: "right", vertical: "middle" };

      const kCell = worksheet.getCell("K"+iterater);
      kCell.value = asm[key];
      kCell.font = { size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      kCell.numFmt = '#,##0'
      iterater++;
  }

  return workbook;
}

export const downloadExcel = async () => {
    
    
    const convertTxt = (item) => parseInt(item) === 0 || !item ? '-' : String(item);

    var data = [], register = [];
    try{
        const res = await axios.get(`${URL}excelfile`);
        data = res.data.records;
        register = res.data.register;
        console.log(res.data);
    }
    catch(error){
        console.log(error);
        return;
    }

    const workbook = new ExcelJS.Workbook();
    // Iterate through sheets in data
    for (var i = data.length -1; i >=0; i--) {
      const sheetData = data[i];
      const worksheet = workbook.addWorksheet(`${MONTHS[sheetData.month-1]} ${sheetData.year}`);


    // Add workbook properties
    workbook.creator = "9Am";
    workbook.created = new Date();

      // Add header row
      worksheet.mergeCells("A1:F1");
      const headerCell = worksheet.getCell("A1");
      headerCell.value = MONTHS[sheetData.month-1] + " MONTH " + sheetData.year;
      headerCell.font = { size: 28 , color: { argb: "FF70AD47" },  name: "Bahnschrift Condensed" };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      worksheet.addRow([]);
      worksheet.getCell("B2").value = "TOTAL USAGE : ";
      worksheet.getRow(1).height = 35;
      worksheet.getRow(2).height = 28;
      worksheet.getCell("B2").font ={ size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      worksheet.getCell("B2").alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell("C2").value = register[i].usage;
      worksheet.getCell("C2").font = { size: 20 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
      worksheet.getCell("C2").numFmt = '#,##0'
      worksheet.getCell("C2").alignment = { horizontal: "left", vertical: "middle" };


      worksheet.addRow([]);
      // Add table headers
      const headers = ["DATE", "DESCRIPTION", "QUANTITY", "CREDIT", "DEBIT", "BALANCE"];
      const headerRow = worksheet.addRow(headers);

      // Style headers
      headerRow.font = { size: 20 , color: { argb: "FFFFFFFF" },  name: "Bahnschrift Condensed" };
      headerRow.eachCell(cell=>{
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "00000000" } };
      })
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;

      // Add transaction data
      sheetData.transactions.forEach((transaction) => {
        const row = worksheet.addRow([
        //   convertToDate(transaction.date),
        String(new Date(transaction.date).getDate()).padStart(2, '0')+ '-' + String(sheetData.month)?.padStart(2, '0') + '-'+ sheetData.year,
          transaction.description.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          convertTxt(transaction?.quantity),
          convertTxt(transaction?.credit),
          convertTxt(transaction?.debit),
          transaction.balance,
        ]);
        row.eachCell((cell, colIndex) => {
          if (colIndex === 1 && transaction.description.includes("Money Credited")) {
            cell.font = { color: { argb: "FFFF0000" } }; // Highlight "Money Credited" in red
          }

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          if(colIndex > 2 && cell.value !== '-'){
              cell.numFmt = '#,##0'
          }
        });
        row.alignment = { horizontal: "center", vertical: "middle" };
        row.font = { size: 18 , color: { argb: "00000000" },  name: "Bahnschrift Condensed" };
        row.height = 25;
      });

      // Set column widths
      worksheet.columns = [
        { width: 20 }, // DATE
        { width: 30 }, // DESCRIPTION
        { width: 17 }, // QUANTITY
        { width: 17 }, // DEBIT
        { width: 17 }, 
        { width: 17 }, 
      ];
    }

    addRegisterPage(workbook, register);

    // Generate and save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "9AM.xlsx");
  };