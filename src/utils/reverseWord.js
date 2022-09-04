

const reverseWord = (word) => {
 if (typeof word === "object") {
  return word = word.map(token => token.split('').reverse().join(""));
 } else {
  return word.split('').reverse().join("");
 }
}

module.exports = reverseWord;