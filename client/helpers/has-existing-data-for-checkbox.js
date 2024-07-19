/**
 * @desc Takes @param obj:Object and recursively checks if there is any existing data in the 'text' fields of the nodes.
 * @returns {boolean} True if any text field is not empty, otherwise False.
 * */
const hasNtsNodesWithData = (obj) => {
    if (!obj || typeof obj !== 'object') {
        return false;
    }

    const checkNodes = (nodes) => {
        for (let node of nodes) {
            if (node.object === 'text' && node.text && node.text.trim() !== '') {
                return true;
            }
            if (node.object === 'block' && node.nodes && checkNodes(node.nodes)) {
                return true;
            }
        }
        return false;
    };

    if (obj.document && obj.document.nodes) {
        return checkNodes(obj.document.nodes);
    }

    return false;
};

export default hasExistingData;
