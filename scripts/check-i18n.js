const fs = require("fs");
const path = require("path");

const localeDir = path.resolve(__dirname, "../src/locale");
const localeNames = ["zh-CN", "zh-TW", "en-US", "vi"];

function evaluateDefaultExport(filename, imports = {}) {
    let source = fs.readFileSync(path.join(localeDir, `${filename}.js`), "utf8");
    source = source.replace(
        /^import\s+(\w+)\s+from\s+["']\.\/([^"']+)["'];?\s*$/gm,
        (_, localName, importName) => `const ${localName} = __imports[${JSON.stringify(importName)}];`
    );
    source = source.replace(/export\s+default\s+/, "return ");
    return Function("__imports", source)(imports);
}

const zhCN = evaluateDefaultExport("zh-CN");
const messages = {
    "zh-CN": zhCN,
    "zh-TW": evaluateDefaultExport("zh-TW", { "zh-CN": zhCN }),
    "en-US": evaluateDefaultExport("en-US"),
    vi: evaluateDefaultExport("vi"),
};

function flatten(value, prefix = "", output = {}) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        for (const [key, child] of Object.entries(value)) {
            flatten(child, prefix ? `${prefix}.${key}` : key, output);
        }
    } else {
        output[prefix] = value;
    }
    return output;
}

function placeholders(value) {
    if (typeof value !== "string") return [];
    return [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
}

const flattened = Object.fromEntries(localeNames.map((locale) => [locale, flatten(messages[locale])]));
const expectedKeys = Object.keys(flattened["zh-CN"]).sort();
const failures = [];

for (const locale of localeNames) {
    const actualKeys = Object.keys(flattened[locale]).sort();
    const missing = expectedKeys.filter((key) => !actualKeys.includes(key));
    const extra = actualKeys.filter((key) => !expectedKeys.includes(key));
    if (missing.length) failures.push(`${locale} missing keys: ${missing.join(", ")}`);
    if (extra.length) failures.push(`${locale} extra keys: ${extra.join(", ")}`);

    for (const key of expectedKeys) {
        const expectedParams = placeholders(flattened["zh-CN"][key]);
        const actualParams = placeholders(flattened[locale][key]);
        if (expectedParams.join(",") !== actualParams.join(",")) {
            failures.push(
                `${locale} placeholder mismatch at ${key}: expected {${expectedParams.join(",")}}, got {${actualParams.join(",")}}`
            );
        }
    }
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
} else {
    console.log(`Validated ${expectedKeys.length} i18n leaves across ${localeNames.length} locales.`);
}
