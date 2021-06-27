// 将早期数据统一成当前格式
function fixOldData(olddata) {
    let newdata = {
        tBone: {},
        tDecal: {},
        nRoleType: ~~olddata.misc[0].value,
    };

    olddata.decal.forEach((decal) => {
        newdata.tDecal[decal.name] = {
            nShowID : ~~decal.value
        }
    })

    let arr = ['eye','mouth','nose','face']
    arr.forEach((key) => {
        olddata[key].forEach((item) => {
            newdata.tBone[item.name] = ~~item.value
        })
    })

    return newdata
}

export default fixOldData;
