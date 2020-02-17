/* 如果電話號碼少於 10 個號碼，打印出「請看眼科」; 如果電話號碼等於 10 個號碼，
打印出「身心健康」; 如果電話號碼大於 10 個號碼，打印出「請看腦科」。*/
console.clear();

var arr = String(012345678);

// console.log(arr.length);
if(arr.length< 10) {
  console.log("請看眼科");
  
}else if(arr.length==10){
  console.log("身心健康");
  
}else if(arr.length>10){
   console.log("請看腦科");
};