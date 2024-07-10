const { diffChars } = require('diff');

const findArrayDifferences = (oldArray, newArray) => {
    const changes = [];

    oldArray.forEach((oldStr, arrayIndex) => {
        const newStr = newArray[arrayIndex] || "";

        const diffResult = diffChars(oldStr, newStr);

        let charIndexOld = 0;
        let charIndexNew = 0;

        diffResult.forEach(part => {
            if (part.added) {
                for (let i = 0; i < part.count; i++) {
                    changes.push({
                        arrayIndex,
                        charIndex: charIndexNew,
                        oldChar: '',
                        newChar: part.value[i]
                    });
                    charIndexNew++;
                }
            } else if (part.removed) {
                for (let i = 0; i < part.count; i++) {
                    changes.push({
                        arrayIndex,
                        charIndex: charIndexOld,
                        oldChar: part.value[i],
                        newChar: ''
                    });
                    charIndexOld++;
                }
            } else {
                charIndexOld += part.count;
                charIndexNew += part.count;
            }
        });
    });

    newArray.slice(oldArray.length).forEach((newStr, arrayIndex) => {
        const globalArrayIndex = oldArray.length + arrayIndex;
        for (let charIndexNew = 0; charIndexNew < newStr.length; charIndexNew++) {
            changes.push({
                arrayIndex: globalArrayIndex,
                charIndex: charIndexNew,
                oldChar: '',
                newChar: newStr[charIndexNew]
            });
        }
    });

    return changes;
};

// Example usage:
const oldArray = ["Bingo", "Blue"];
const newArray = ["Bngo", "Bliu"];

const changes = findArrayDifferences(oldArray, newArray);
console.log(changes);
