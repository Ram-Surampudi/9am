import axios from "axios";
import { URL } from "../App";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const downloadExcel = async () => {
    
    const MONTHS = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];
    
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
      headerCell.font = { bold: true, size: 20, color: { argb: "FF008000" } };
      headerCell.alignment = { horizontal: "center", vertical: "middle" };

      worksheet.addRow([]);
      worksheet.getCell("B2").value = "Total Usage :";
      worksheet.getRow(1).height = 35;
      worksheet.getRow(2).height = 28;
      worksheet.getCell("B2").font = { bold: true, size: 16 };
      worksheet.getCell("B2").alignment = { horizontal: "right", vertical: "middle" };
      worksheet.getCell("C2").value = register[i].usage;
      worksheet.getCell("C2").font = { bold: true, size: 16 };
      worksheet.getCell("C2").alignment = { horizontal: "left", vertical: "middle" };


      worksheet.addRow([]);
      // Add table headers
      const headers = ["DATE", "DESCRIPTION", "QUANTITY", "CREDIT", "DEBIT", "BALANCE"];
      const headerRow = worksheet.addRow(headers);

      // Style headers
      headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size : 16 };
      headerRow.eachCell(cell=>{
          cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF6600" } };
      })
      headerRow.alignment = { horizontal: "center", vertical: "middle" };
      headerRow.height = 30;

      // Add transaction data
      sheetData.transactions.forEach((transaction) => {
        const row = worksheet.addRow([
        //   convertToDate(transaction.date),
        String(new Date(transaction.date).getDate()).padStart(2, '0')+ '-' + String(sheetData.month)?.padStart(2, '0') + '-'+ sheetData.year,
          transaction.description,
          convertTxt(transaction?.quantity),
          convertTxt(transaction?.credit),
          convertTxt(transaction?.debit),
          transaction.balance,
        ]);
        row.eachCell((cell, colIndex) => {
          if (colIndex === 2 && transaction.description.includes("Money Credited")) {
            cell.font = { color: { argb: "FFFF0000" } }; // Highlight "Money Credited" in red
          }

          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
        });
        row.alignment = { horizontal: "center", vertical: "middle" };
        row.font = {size: 14 };
        row.height = 25;
        row.numFmt = "@";
      });

      // Set column widths
      worksheet.columns = [
        { width: 15 }, // DATE
        { width: 25 }, // DESCRIPTION
        { width: 15 }, // QUANTITY
        { width: 10 }, // DEBIT
        { width: 15 }, 
        { width: 15 }, 
      ];
    }

    const worksheet = workbook.addWorksheet("REGISTER");

    worksheet.mergeCells("A1:F1");
    const headerCell = worksheet.getCell("A1");
    headerCell.value = "MONEY REGISTER";
    headerCell.font = { bold: true, size: 20, color: { argb: "FF008000" } };
    headerCell.alignment = { horizontal: "center", vertical: "middle" };

    let tmc =0, tu=0;

    register.forEach(item=>{
        tmc += item.money_credited;
        tu += item.usage;
    });

    worksheet.addRow([]);
    worksheet.getCell("B2").value = "TOTAL MONEY CREDITED :";
    worksheet.getRow(1).height = 35;
    worksheet.getRow(2).height = 28;
    worksheet.getCell("B2").font = { bold: true, size: 16 };
    worksheet.getCell("B2").alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell("C2").value = tmc;
    worksheet.getCell("C2").font = { bold: true, size: 16 };
    worksheet.getCell("C2").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.getCell("B3").value = "TOTAL USAGE :";
    worksheet.getRow(1).height = 35;
    worksheet.getRow(2).height = 28;
    worksheet.getCell("B3").font = { bold: true, size: 16 };
    worksheet.getCell("B3").alignment = { horizontal: "right", vertical: "middle" };
    worksheet.getCell("C3").value = tu;
    worksheet.getCell("C3").font = { bold: true, size: 16 };
    worksheet.getCell("C3").alignment = { horizontal: "left", vertical: "middle" };

    worksheet.addRow([]);
    const headers = ["YEAR", "MONTH", "MONEY CREDITED", "HOSTEL FEE", "USAGE", "BALANCE"];
    const headerRow = worksheet.addRow(headers);

    // Style headers
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size : 16 };
    headerRow.eachCell(cell=>{
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFF6600" } };
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
      });
      row.alignment = { horizontal: "center", vertical: "middle" };
      row.font = {size: 14 };
      row.height = 25;
    });

    // Set column widths
    worksheet.columns = [
      { width: 15 }, // DATE
      { width: 25 }, // DESCRIPTION
      { width: 25 }, // QUANTITY
      { width: 25 }, // DEBIT
      { width: 15 }, 
      { width: 15 }, 
    ];

    // Generate and save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "9AM.xlsx");
  };