console.log('this is a fake server to startup docker-compose and init project inside the container');
let counter = 0;
setInterval(() => {
  console.log(++counter);
}, 1000);
