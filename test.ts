// const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
// const data = await res.json();
// console.log(data);

import { soxa } from 'https://deno.land/x/soxa/mod.ts'

soxa.get('https://jsonplaceholder.typicode.com/todos/1')
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
  