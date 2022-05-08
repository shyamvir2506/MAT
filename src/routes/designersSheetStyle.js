exports.sheetStyle = (worksheet) => {
    worksheet.columns = [
        { header: 'FUNCTIONAL MANAGER', key: 'fm', width: 30 },
        { header: 'EMPLOYEE', key: 'emp', width: 20 },
        { header: 'REGION', key: 'region', width: 20 },
        { header: 'PARAMETERS', key: 'prms', width: 25 },
        { header: '', key: 'prms', width: 25 },
        { header: 'PERFORMANCE', key: 'prf', width: 35 },
        { header: 'NOTES', key: 'notes', width: 35 },
        { header: 'Sub - Rating', key: 'sub-rating', width: 20 },
        { header: 'Quarter Rating', key: 'qrating', width: 22 },
        { header: 'Quarter Feedback', key: 'qf', width: 40 },
        { header: 'Aditional Feedback', key: 'af', width: 40 },
    ];

    worksheet.getRow('1').fill = { type: 'pattern', pattern:'solid', bgColor:{argb:'FF000000'} };
    worksheet.getRow('1').font = { name: 'Arial Black', color: { argb: 'FFFFFFFF' }, family: 1, size: 10 };

    return worksheet
}

exports.fillValues = (worksheet, dataobj, rowIndex) => {
    const {name, designation, data} = dataobj;
    worksheet.getCell('A'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    worksheet.getCell('B'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    worksheet.getCell('C'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

    worksheet.getCell('I'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    worksheet.getCell('J'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
    worksheet.getCell('K'+rowIndex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

    worksheet.getCell('A'+rowIndex).value = data.manager;
    worksheet.getCell('C'+rowIndex).value = data.zone;
    worksheet.getCell('B'+rowIndex).value = name;

    let tindex = findex = rowIndex;
    for(let j=0; j<data.values.length-1; j++){
        let obj = data.values[j];

        obj.performance.forEach((tobj, index) => {
            let key = Object.keys(tobj)[0];
            tobj[key] = tobj[key].replace('|', '• ');
            worksheet.getCell('E'+findex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
            worksheet.getCell('E'+findex).value = key;
            let regex = /\|/ig;
            worksheet.getCell('F'+findex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
            worksheet.getCell('F'+findex).value = tobj[key].replace(regex, '\n• ');

            worksheet.getCell('G'+findex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
            worksheet.getCell('G'+findex).value = tobj.feedback/* && {
                'richText':[
                    {font:{'color': {'argb': 'FFFF6600'}}, text:'link', hyperlink:'https://www.vdx.tv', tooltip:'exponential'},
                    {font:{'color': {'argb': 'FFFF6600'}}, text:'second demo link', hyperlink:'https://www.google.com', tooltip:'google'},
                    {font:{'color': {'argb': 'FFFF6600'}}, text:'not working as expected'}
                ]
            };*/
            findex++;
        })

        //merge and fill value for paramaters//
        worksheet.mergeCells("'D"+tindex+":D"+Number(findex-1)+"'");
        worksheet.getCell('D'+tindex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
        worksheet.getCell('D'+tindex).value = obj.key;

        //merge and fill value for rating//
        worksheet.mergeCells("'H"+tindex+":H"+Number(findex-1)+"'");
        worksheet.getCell('H'+tindex).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
        worksheet.getCell('H'+tindex).value = obj.rating;
        tindex = findex;
    }

    //worksheet.mergeCells("'A"+rowIndex+":A"+Number(findex-1)+"'");
    worksheet.mergeCells("'B"+rowIndex+":B"+Number(findex-1)+"'");
    worksheet.mergeCells("'C"+rowIndex+":C"+Number(findex-1)+"'");
    worksheet.mergeCells("'I"+rowIndex+":I"+Number(findex-1)+"'");
    worksheet.mergeCells("'J"+rowIndex+":J"+Number(findex-1)+"'");
    worksheet.mergeCells("'K"+rowIndex+":K"+Number(findex-1)+"'");

    worksheet.getCell('I'+rowIndex).value = data.values[data.values.length-1].rating;
    worksheet.getCell('J'+rowIndex).value = data.values[data.values.length-1].feedback && {
        'richText':[
            {'text':data.values[data.values.length-1].feedback}
        ]
    };
    worksheet.getCell('K'+rowIndex).value = data.extraFeedback && data.extraFeedback.manager && {
        'richText':[
            {'text':data.extraFeedback.reason+'\n'+data.extraFeedback.feedback},
            {'text':'\n\n\n Feedback given by '},
            {'font':{'bold':true, 'size': 13,'color': {'argb': 'FFFF6600'}}, 'text':data.extraFeedback.manager}
        ]
    }

    return { worksheet:worksheet, totalCell:tindex};
}