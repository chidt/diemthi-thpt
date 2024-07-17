import {test, expect} from '@playwright/test';

// Write a function to save data to csv file in same directory
const arrayToCSV = (header, data) => {
    const csvRows = [];
    const headerRow = header.join(',');
    // Add header as the first row
    csvRows.push(headerRow);
    for (const row of data) {
        const values = header.map(header => {
            const escaped = ('' + row[header]).replace(/"/g, '\\"');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
};
test('Doc diem thi', async ({page}) => {
    // Create a header for csv file
    const header = ['SBD', 'Toán', 'Lý', 'Hoá', 'Sinh', 'Văn', 'Sử', 'Địa', 'Ngoại Ngữ'];
    const data = [];
    const objectTable = [];
    const url = 'https://diemthi.laodong.vn/';
    const sbds = [
        '01034575','03021074', '01002256', '36000480','01034575','03021074', '01002256', '36000480','01034575','03021074',
    
    ];
    await page.goto(url);
    // For each sbd, search and print the result
    for (let sbd = 0; sbd < sbds.length; sbd++) {
        await page.getByPlaceholder('Tra cứu điểm thi?').click();
        await page.getByPlaceholder('Tra cứu điểm thi?').fill(sbds[sbd]);
        await page.getByRole('button', { name: 'Tìm kiếm' }).click();
        // Wait 3 seconds to show the result
        await page.waitForTimeout(1000);
        const info = await page.getByRole('heading', { name: 'Số báo danh:' }).getByRole('strong').textContent();

        // Expect the info same as the sbd
        await expect(info).toBe(sbds[sbd]);
        const numberOfRow = 7;
        let i = 1;
        let indexMon = 1;
        let rowData = ['', '', '', '', '', '', '', '', ''];
        let objectData = {
            'SBD': info,
            'Toán': '',
            'Lý': '',
            'Hoá': '',
            'Sinh': '',
            'Văn': '',
            'Sử': '',
            'Địa': '',
            'Ngoại Ngữ': ''
        };        
        console.log(`==============SBD: ${info}==============`);
        rowData[0] = info;
        while (indexMon <= numberOfRow) {
            // Table: body > div:nth-child(2) > div > div > section.site-hero-2023.overlay > div > div.o-detail-thisinh > table > tbody
            let tableScore = await page.locator('body > div:nth-child(2) > div > div > section.site-hero-2023.overlay > div > div.o-detail-thisinh > table > tbody');
            // Skip if no td in the tr tag
            if (await tableScore.locator(`tr:nth-child(${i}) > td`).count() === 0) {
                i++;
                continue;
            }
            // loop to all tr in the table and get text in td
            let tenMon = await tableScore.locator(`tr:nth-child(${i}) > td:nth-child(1)`).textContent();
            let diemMon = await tableScore.locator(`tr:nth-child(${i}) > td:nth-child(2)`).textContent();
            console.log(`Môn ${indexMon}: ${tenMon} ${diemMon}`);
            if(tenMon === 'Toán'){
                rowData[1] = diemMon;
                objectData['Toán'] = diemMon;
            }
            if(tenMon === 'Lý'){
                rowData[2] = diemMon;
                objectData['Lý'] = diemMon;
            }
            if(tenMon === 'Hóa'){
                rowData[3] = diemMon;
                objectData['Hoá'] = diemMon;
            }
            if(tenMon === 'Sinh'){
                rowData[4] = diemMon;
                objectData['Sinh'] = diemMon;
            }
            if(tenMon === 'Văn'){
                rowData[5] = diemMon;
                objectData['Văn'] = diemMon;
            }
            if(tenMon === 'Sử'){
                rowData[6] = diemMon;
                objectData['Sử'] = diemMon;
            }
            if(tenMon === 'Địa'){
                rowData[7] = diemMon;
                objectData['Địa'] = diemMon;
            }
            if(tenMon === 'Ngoại ngữ'){
                rowData[8] = diemMon;
                objectData['Ngoại Ngữ'] = diemMon;
            }
            i++;
            indexMon++;
            data.push(objectData);
            objectTable.push(objectData);
        }
        
    }
    // Print result as a table in the console
    // set header for console table is data[0]
    console.log('==================RESULT==================');
    console.table(objectTable);
    // Save data to csv file
    const csv = arrayToCSV(header, data);
    const fs = require('fs');
    fs.writeFileSync('result.csv', csv);
    console.log('==================Save data to result.csv==================');
}); 