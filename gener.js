var gen = idMaker();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); //2


function *idMaker(){
  var index = 0;
  for (let  i = 0; i<300; i++){
    yield index++;
  }
}