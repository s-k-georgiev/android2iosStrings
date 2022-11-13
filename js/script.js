const inputLabel = document.getElementById("input-label")
const outputLabel = document.getElementById("output-label")
const input = document.getElementById("input")
const output = document.getElementById("output")
const checkbox = document.getElementById("checkbox")
const button = document.getElementById("button")
const title = document.getElementById("title")
const alert = document.getElementById("alert")

onCheckboxClicked()

function showError() {
    $('#alert').show()
    setTimeout(function () {
        $("#alert").hide()
    }, 2000)
}

function convertAndroid2IOS() {
    const parser = new DOMParser()
    const valueWithParent = "<resources>" + input.value + "</resources>"
    const xml = parser.parseFromString(valueWithParent, "text/xml")
    const strings = xml.getElementsByTagName("string")
    let iosStrings = ""
    for (i = 0; i < strings.length; i++) {
        const stringElement = strings[i]
        const name = stringElement.getAttributeNode("name").value
        const value = stringElement.childNodes[0].nodeValue
        iosStrings += `"${name}" = "${value.replace("%s", "%@")}";`
        if (i < strings.length - 1) {
            iosStrings += "\n"
        }
    }
    copyToClipboard(iosStrings)
}

function convertIOS2Android() {
    const strings = input.value
        .replace("  ", "")
        .replace("\n", "")
        .split(";")
    let iosStrings = ""
    for (i = 0; i < strings.length; i++) {
        const stringElement = strings[i]
        const nameAndValue = stringElement.split("=")
        if (nameAndValue.length == 2) {
            const name = getStringBetweenQuotationMarks(nameAndValue[0])
            const value = getStringBetweenQuotationMarks(nameAndValue[1]).replace("%@", "%s")
            iosStrings += `<string name="${name}">${value}</string>`
            if (i < strings.length - 1) {
                iosStrings += "\n"
            }
        }
    }
    copyToClipboard(iosStrings)
}

function copyToClipboard(string) {
    output.value = string
    output.select();
    output.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(output.value);
}

function getStringBetweenQuotationMarks(string) {
    let start = string.indexOf("\"")
    let end = string.lastIndexOf("\"")
    return string.substring(start + 1, end)
}

function onCheckboxClicked() {
    if (checkbox.checked) {
        output.value = ""
        input.value = ""
        title.innerHTML = "Android to iOS strings"
        inputLabel.innerHTML = "Android String resources:"
        outputLabel.innerHTML = "iOS Strings:"
        input.placeholder =
            `<string name="main_title">This is emoji: 📚</string>
<string name="age_text">He is %s years old!</string>
<string name="question">What\\'s your name?</string>`
    } else {
        output.value = ""
        input.value = ""
        title.innerHTML = "iOS to Android strings"
        inputLabel.innerHTML = "iOS Strings:"
        outputLabel.innerHTML = "Android String resources:"
        input.value = ""
        input.placeholder =
            `"main_title" = "This is emoji: 📚";
"age_text" = "He is %@ years old!";
"question" = "What\\'s your name?";`
    }
}

checkbox.onclick = (e) => {
    onCheckboxClicked()
}

button.onclick = (e) => {
    if (checkbox.checked) {
        convertAndroid2IOS()
    } else {
        convertIOS2Android()
    }
}