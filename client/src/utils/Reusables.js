export const getZoneList = (tlist, year, quarter) => {
    let tarr = [];
    tlist.forEach(obj=>{
        let tzone = obj.data[year][Number(quarter.split("Q")[1])-1] && obj.data[year][Number(quarter.split("Q")[1])-1].zone;
        if(tarr.indexOf(tzone) === -1 && tzone){
            tarr.push(tzone)
        }
    });
    return tarr;
}


function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = [];
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }

        if (i > 0)
            costs[s2.length] = lastValue;
    }

    return costs[s2.length];
}

export const MatchZones = (zone1, zone2) => {
    if(zone1 && zone2 && zone1.split(' ')[0]===zone2.split(' ')[0] && zone1.replace('/',',').split(',')[0]===zone2.replace('/',',').split(',')[0]){
        return true;
    }
    return false;
}

export const SortObjects = (list, key) => {
    list.sort((a,b) => {
        let str1 = a[key].toLowerCase();
        let str2 = b[key].toLowerCase();
       
        if(str1>str2){
            return 1
        } else if(str1<str2){
            return -1
        }
        
        return 0;
    });
} 

export const MatchStrings = (s1, s2) => {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;//new Promise(resolve=>resolve(1.0));
    }

    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);

    /*return new Promise(resolve => {
        resolve((longerLength - editDistance(longer, shorter)) / parseFloat(longerLength));
    });*/
}
