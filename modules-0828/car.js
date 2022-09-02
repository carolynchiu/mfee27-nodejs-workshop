// exports = module.exports = {};

// exports.name = "aaa";
// exports.getName = () => {
//   return "bbb";
// };
// module.exports.age = 18;

let car = {
  name: "aaa",
  getName: function () {
    return "bbb";
  },
  age: 18,
};

// module.exports = car; // { name: 'aaa', getName: [Function: getName], age: 18 }
exports = car; // {} -> 盡量不要用 exports
// return module.exports;
