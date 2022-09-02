const pathSplitter = (fullPath, criteria) => {
 let splitIndex = fullPath.indexOf(criteria);
 let actualPath = fullPath.substr(0, splitIndex);
 return actualPath+'uploads/';
}

module.exports = pathSplitter;
