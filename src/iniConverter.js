/* INI 格式捏脸转 LuaTable 格式 */

// 读 Face 节下指定键的数值
function getFaceProperty(ini, key) {
    return parseInt(ini["Face"][key]);
}

// 读指定键的 Decal 数值组
function getDecalSection(ini, sectionName) {
    return {
        "fValue1": parseFloat(ini["CustomDetail"][sectionName + "_value1"]),
        "nColorID": parseInt(ini["Decal"][sectionName + "_color"]),
        "bUse": !!parseInt(ini["CustomDetail"][sectionName + "_valueEnable"]),
        "nShowID": parseInt(ini["Decal"][sectionName]),
        "fValue3": parseFloat(ini["CustomDetail"][sectionName + "_value3"]),
        "fValue2": parseFloat(ini["CustomDetail"][sectionName + "_value2"])
    }
}

// INI 格式转 LuaTable 格式
export function convertIni(ini) {
    return {
        "nDecorationID": parseInt(ini["Base"]["DecorationID"]),
        "tDecal":{
            "BASE": getDecalSection(ini, "FaceBaseTexture"),
            "BROW": getDecalSection(ini, "Brow"),
            "EYE_SHADOW": getDecalSection(ini, "EyeShadow"),
            "LIP_LIGHT": getDecalSection(ini, "LipLight"),
            "LIP_FLASH": getDecalSection(ini, "LipFlash"),
            "IRIS_LEFT": getDecalSection(ini, "IrisLeft"),
            "EYE_LIGHT": getDecalSection(ini, "EyeLight"),
            "BLUSHER_MOUSTACHE": getDecalSection(ini, "BlusherMoustache"),
            "EYE_LINE": getDecalSection(ini, "EyeLine"),
            "LIP_GLOSS": getDecalSection(ini, "LipGloss"),
            "DECAL": getDecalSection(ini, "Decal"),
            "IRIS_RIGHT": getDecalSection(ini, "IrisRight"),
            "LIP_OVERLAP":getDecalSection(ini, "LipOverlap")
        },
        "nRoleType": parseInt(ini["Base"]["RoleType"]),
        "tBone":{
            "NOSE_SIZE": getFaceProperty(ini, "noseSize"),
            "UP_LIP_OUT": getFaceProperty(ini, "upLipOut"),
            "NOSEBOW_WIDTH": getFaceProperty(ini, "nosebowWidth"),
            "MOUTH_OPEN": getFaceProperty(ini, "mouthOpen"),
            "CHEEK_Y": getFaceProperty(ini, "cheekY"),
            "EYE_OPEN": getFaceProperty(ini, "eyeOpen"),
            "FACE_Y": getFaceProperty(ini, "faceY"),
            "MOUTH_END_L": getFaceProperty(ini, "mouthEndL"),
            "JAW_LENGTH": getFaceProperty(ini, "jawLength"),
            "UP_LIP": getFaceProperty(ini, "upLip"),
            "EYE_DIST": getFaceProperty(ini, "eyeDist"),
            "NOSETOP_POS_Y": getFaceProperty(ini, "nosetopPosY"),
            "EYE_DIRC": getFaceProperty(ini, "eyeDirc"),
            "EYEBOW_OUT": getFaceProperty(ini, "eyebowOut"),
            "MOUTH_OUT": getFaceProperty(ini, "mouthOut"),
            "RIDGE_Y": getFaceProperty(ini, "ridgeY"),
            "MOUTH_END": getFaceProperty(ini, "mouthEnd"),
            "NOSEBOW_BEND": getFaceProperty(ini, "nosebowBend"),
            "JAW_WIDTH": getFaceProperty(ini, "jawWidth"),
            "LOW_LIP_POS": getFaceProperty(ini, "lowLipPos"),
            "PUPIL_DIRC": getFaceProperty(ini, "pupilDirc"),
            "NOSETOP_POS_Z": getFaceProperty(ini, "nosetopPosZ"),
            "MOUTH_POS": getFaceProperty(ini, "mouthPos"),
            "MOUTH_SIZE": getFaceProperty(ini, "mouthSize"),
            "LOW_LIP": getFaceProperty(ini, "lowLip"),
            "FACE_Z": getFaceProperty(ini, "faceZ"),
            "NOSETOP_WIDTH": getFaceProperty(ini, "nosetopWidth"),
            "UP_FACE": getFaceProperty(ini, "upFace"),
            "UP_LID_POS": getFaceProperty(ini, "upLidPos"),
            "EYEBOW_POS": getFaceProperty(ini, "eyebowPos"),
            "EYEBOW_DIRC": getFaceProperty(ini, "eyebowDirc"),
            "UP_LIP_POS": getFaceProperty(ini, "upLipPos"),
            "LOW_LIP_OUT": getFaceProperty(ini, "lowLipOut"),
            "MOUTH_ROT": getFaceProperty(ini, "mouthRot"),
            "EYE_SIZE": getFaceProperty(ini, "eyeSize"),
            "EYE_POS": getFaceProperty(ini, "eyePos"),
            "JAW_ROT": getFaceProperty(ini, "jawRot"),
            "JAW_END": getFaceProperty(ini, "jawEnd"),
            "EYECROW_Y": getFaceProperty(ini, "eyecrowY"),
            "NOSETOP_UP": getFaceProperty(ini, "nosetopUp"),
            "MOUTH_END_R": getFaceProperty(ini, "mouthEndR"),
            "OUT": getFaceProperty(ini, "out"),
            "JAW_POS": getFaceProperty(ini, "jawPos"),
            "LOW_FACE": getFaceProperty(ini, "lowFace"),
            "CHEEK_Z": getFaceProperty(ini, "cheekZ"),
            "PUPIL_SIZE": getFaceProperty(ini, "pupilSize"),
            "FACE_SCALE": getFaceProperty(ini, "faceScale"),
            "NOSE_HEIGHT": getFaceProperty(ini, "noseHeight"),
            "LOW_LID_POS": getFaceProperty(ini, "lowLidPos")
        }
    };
}
