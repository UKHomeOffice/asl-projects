const { diffChars } = require('diff');

const findArrayDifferences = (oldArray, newArray) => {
    const changes = [];

    oldArray.forEach((oldStr, arrayIndex) => {
        const newStr = newArray[arrayIndex] || "";

        const diffResult = diffChars(oldStr, newStr);

        let charIndexOld = 0;
        let charIndexNew = 0;

        const changeObj = {
            arrayIndex,
            added: [],
            removed: []
        };

        diffResult.forEach(part => {
            if (part.added) {
                changeObj.added.push({
                    value: part.value,
                    charIndex: charIndexNew,
                    start: charIndexNew,
                    end: charIndexNew + part.value.length - 1
                });
                charIndexNew += part.value.length;
            } else if (part.removed) {
                changeObj.removed.push({
                    value: part.value,
                    charIndex: charIndexOld,
                    start: charIndexOld,
                    end: charIndexOld + part.value.length - 1
                });
                charIndexOld += part.value.length;
            } else {
                charIndexOld += part.value.length;
                charIndexNew += part.value.length;
            }
        });

        changes.push(changeObj);
    });

    newArray.slice(oldArray.length).forEach((newStr, arrayIndex) => {
        const globalArrayIndex = oldArray.length + arrayIndex;
        const changeObj = {
            arrayIndex: globalArrayIndex,
            added: [],
            removed: []
        };
        for (let charIndexNew = 0; charIndexNew < newStr.length; charIndexNew++) {
            changeObj.added.push({
                value: newStr[charIndexNew],
                charIndex: charIndexNew,
                start: charIndexNew,
                end: charIndexNew
            });
        }
        changes.push(changeObj);
    });

    return changes;
};

// Example usage:
const oldArray = ["Bingo", "Blue"];
const newArray = ["Bngo", "Blu"];

const changes = findArrayDifferences(oldArray, newArray);
console.log(JSON.stringify(changes, null, 2));
