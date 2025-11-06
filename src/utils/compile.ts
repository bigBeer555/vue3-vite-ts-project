// // export const compileTemplate = (template: string) => {
// //   const interpolationRegex = /\{\{(.+?)\}\}/g;
// //   const compiled = template.replace(interpolationRegex, (_, expr) => {
// //     return `_ctx.${expr.trim()}`;
// //   });

// //    // 包装成一个 render 函数体
// //   const renderFnCode = `
// //     function render(ctx) {
// //       return \`${compiled}\`;
// //     }
// //   `;
  
// //   const renderCode = compileTemplate(`<div>{{ msg }}!</div>`);
// //   const ctx = { msg: 'Hello' };
// //   return renderFnCode;
// // }


// // 定义一个正则用于匹配双大括号语法
// const templateRegex = /\{\{(.+)\}\}/g

// const template = `
//   <div>
//     <h1>Hello, {{name}}!</h1>
//     <p>Welcome to {{company}}.</p >
//     <p>Today is {{details.day}}.</p >
//   </div>
// `

// const data = {
//   name: 'John Doe',
//   company: 'Acme Inc.',
//   details: {
//     day: 'Monday',
//   },
// }

// // 从链式中获取值
// const getValueFromChain = (chain, data) => {
//   const keys = chain.split('.')
//   let value = data
//   for (const key of keys) {
//     value = value[key]
//   }
//   return value
// }

// const render = (template, data) => {
//   const matches = template.match(templateRegex)
//   if (!matches) {
//     return template
//   }
//   matches.forEach(match => {
//     const key = match.replace('{{', '').replace('}}', '')
//     const value = getValueFromChain(key, data)
//     template = template.replace(match, value)
//   })
//   console.log(template)
// }

// const proxy = new Proxy(data, {
//   get(target, key) {
//     const value = Reflect.get(target, key)
//     return value
//   },
//   set(target, key, value) {
//     const result = Reflect.set(target, key, value)
//     render(template, proxy)
//     return result
//   }
// })

// render(template, proxy)

// proxy.name = 'Jane Tino'